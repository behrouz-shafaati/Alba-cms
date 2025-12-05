const bcrypt = require('bcryptjs')
import coreController from '@/lib/entity/core/controller'
// import roleCtrl from "@entity/role/controller";
// import accessCtrl from "@entity/access/controller";
import userService from './service'
import userSchema from './schema'
import { ChangePassword, User } from './interface'
import {
  Create,
  Id,
  QueryFind,
  QueryFindById,
} from '@/lib/entity/core/interface'
import { z } from 'zod'
import shippingAddressCtrl from '../shippingAddress/controller'
import generateHumanId from './utils/generateUsername'
// import { Role } from "@entity/role/interface";
// import hash from "@/utils/hash";

class controller extends coreController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the userController class extended of the main parent class baseController.
   *
   * @param service - userService
   *
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$firstName', '$email', '$lastName', '$mobile'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'orderBy' && value == 'name') {
        filters.orderBy = 'firstName'
      }
      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async create(payload: Create): Promise<any> {
    let foundUser = await this.findOne({
      filters: { email: payload.params.email },
    })
    if (foundUser) {
      throw new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'string',
          path: ['email'],
          message: 'ایمیل تکراری است.',
        },
      ])
    }

    if (
      typeof payload?.params.mobile !== 'undefined' &&
      payload?.params.mobile !== ''
    )
      foundUser = await this.findOne({
        filters: { mobile: payload.params.mobile },
      })
    if (foundUser) {
      throw new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['mobile'],
          message: 'موبایل تکراری است.',
        },
      ])
    }

    const user = await super.create(payload)
    return user
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    return super.find(payload)
  }

  // async findByQuery(payload: SearchQueryFind) {

  // }

  // async getSuperAdmin() {
  //   const roleSuperAdmin = await roleCtrl.getRoleBySlug("super_admin");
  //   if (!roleSuperAdmin) throw new Error("Role super admin is deleted.");
  //   const userSuperAdmin = await this.findOne({
  //     filters: { roles: roleSuperAdmin.id },
  //   });
  //   return userSuperAdmin;
  // }

  // async getListAccess(userId: Id) {
  //   const listAccess: string[] = [];
  //   const user = await this.findById({ id: userId });
  //   for (let i = 0; i < user.roles.length; i++) {
  //     const role: Role = user.roles[i];
  //     const accesses = await accessCtrl.findAll({
  //       filters: { roleId: role.id },
  //       populate: "requestId",
  //     });
  //     for (let j = 0; j < accesses.data.length; j += 1) {
  //       const request = accesses.data[j].requestId;
  //       if (!request) continue;
  //       if (listAccess.indexOf(request.slug) === -1)
  //         listAccess.push(request.slug);
  //     }
  //   }
  //   return listAccess;
  // }

  // async getUserWithAccesses(userId: Id) {
  //   let user: any = await this.findById({ id: userId });
  //   const listAccess = await this.getListAccess(userId);
  //   user = { ...user.toObject(), accesses: listAccess };
  //   return user;
  // }

  // async changePassword(props: ChangePassword) {
  //   const foundUser: User = await this.findById({ id: props.userId });
  //   if (!foundUser) throw new Error("Unvalid user id.");
  //   // evaluate password
  //   const match = await bcrypt.compare(
  //     props.oldPassword,
  //     foundUser.password
  //   );
  //   if (!match) throw new Error("Invalid old (current) password.");
  //   if (match) {
  //     this.findOneAndUpdate({
  //       filters: props.userId,
  //       params: { password: await hash(props.newPassword) },
  //     });
  //   }
  // }

  async findById(payload: QueryFindById) {
    const user = await super.findById(payload)
    if (!user) return null
    const addresses = await shippingAddressCtrl.findAll({
      filters: { userId: user.id },
    })
    return { ...user, addresses: addresses.data }
  }

  async isExistUnverifiedUserEmail(email: string) {
    let foundUser = await this.findOne({
      filters: { email: email, emailVerified: false },
    })
    return !!foundUser
  }

  async isExistUnverifiedUserMobile(mobile: string) {
    let foundUser = await this.findOne({
      filters: { mobile: mobile, mobileVerified: false },
    })
    return !!foundUser
  }
  async isDuplicateUnverifiedMobileEmail({
    mobile = null,
    email = null,
    throwError = true,
  }: {
    mobile?: string | null
    email?: string | null
    throwError?: boolean
  }) {
    if (email) {
      let foundUser = await this.findOne({
        filters: { email: email },
      })
      if (!!foundUser) {
        if (throwError) throw new Error('DuplicateEmail')
        return true
      }
    }
    if (mobile) {
      let foundUser = await this.findOne({
        filters: { mobile: mobile },
      })
      if (!!foundUser) {
        if (throwError) throw new Error('DuplicateMobile')
        return true
      }
    }
    return false
  }

  async setEmailIsVerified(email: string) {
    await this.findOneAndUpdate({
      filters: { email },
      params: { emailVerified: true },
    })
  }

  async generateUniqueUsername(opt?: any) {
    let flgrepeat = true
    while (flgrepeat) {
      const userName: string = generateHumanId()
      let foundUser = await this.findOne({
        filters: { userName: userName },
      })
      if (!foundUser) return userName
    }
  }
  async updatePassword({
    userId,
    password,
  }: {
    userId: string
    password: string
  }) {
    return this.findOneAndUpdate({ filters: userId, params: { password } })
  }
}

const userCtrl = new controller(new userService(userSchema))
export default userCtrl
