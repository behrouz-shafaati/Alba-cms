import { Role, RolePayload } from '@/features/role/interface'
import userCtrl from '@/features/user/controller'
import roleCtrl from '@/features/role/controller'
import requestCtrl from '@/lib/entity/request/controller'
import { Request } from '@/lib/entity/request/interface'
import accessCtrl from '@/lib/entity/access/controller'
import { User } from '@/features/user/interface'

async function needInitialize(): Promise<boolean> {
  const countUsers: number = await userCtrl.countAll()

  //if user exist so initialize done before.
  const flgInitializationDone: boolean = countUsers > 0 ? true : false
  return flgInitializationDone
}

async function createRoles(): Promise<Role> {
  const superAdmin: RolePayload = {
    acceptTicket: true,
    description:
      'The main admin with allow do all actions and have all perremisions.',
    slug: 'super_admin',
    title: 'Super admin',
    requests: [],
    active: true,
  }

  const admin: Role = await roleCtrl.create({ params: superAdmin })

  const userRole: RolePayload = {
    acceptTicket: false,
    description: 'Normal user. A new user has joined the site.',
    slug: 'user',
    title: 'User',
    requests: [],
    active: true,
  }

  roleCtrl.create({ params: userRole })

  const roleGuest: RolePayload = {
    acceptTicket: false,
    description: 'Guest user. How not loged in.',
    slug: 'guest',
    title: 'Guest',
    requests: [],
    active: true,
  }

  roleCtrl.create({ params: roleGuest })

  return admin
}

async function getSuperAdminRole() {
  const superAdminRole = await roleCtrl.findOne({
    filters: { slug: 'super_admin' },
  })
  if (!superAdminRole) throw new Error("Don't exist super admin role")
  return superAdminRole
}

async function setAccess() {
  const superAdminRole = await getSuperAdminRole()
  const requests = await requestCtrl.findAll({})
  console.log('ount of requests:', requests.data.length)

  // const currentSuperAdminAccess = await accessCtrl.findAll({
  //   filters: { roleId: superAdminRole.id },
  // });
  // // list access must be added
  // const accessNedded: Request[] = [];
  // for (let i = 0; i < requests.data.length; i++) {
  //   let request: Request = requests.data[i];
  //   const haveAccess = currentSuperAdminAccess.data.filter(
  //     (access: Access) => access.id == request.id
  //   );
  //   if (!haveAccess) accessNedded.push(request);
  // }
  // console.log("accessNedded:", accessNedded);

  for (let i = 0; i < requests.data.length; i++) {
    let request: Request = requests.data[i]
    const isExist = await accessCtrl.haveAccess({
      roleId: superAdminRole.id,
      requestId: request.id,
    })
    if (isExist) {
      console.log(`${i} + ${request.slug}`)
    } else {
      console.log(`${i} - ${request.slug}`)
    }
    if (!isExist)
      await accessCtrl.create({
        params: {
          roleId: superAdminRole.id,
          requestId: request.id,
        },
      })
  }
}

async function createSuperAdmin() {
  // Enter super damin (first user) here
  const superAdminRole = await getSuperAdminRole()
  let userPayload: Partial<User> = {
    roles: [superAdminRole.id],
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string,
  }

  const adminUser = await userCtrl.create({ params: userPayload })
  if (!adminUser) {
    throw new Error("Unable to initialize app. Can't create super admin user.")
  }

  console.log(
    `Initialize app done! \n superAdmin login info: \n email: ${userPayload.email} \n password: ${userPayload.password}`
  )
}

export default async function initialize() {
  if (process.env.NODE_ENV == 'production') return
  const initialized: boolean = await needInitialize()
  if (!initialized) {
    const superAdminRole: Role = await createRoles()
    await createSuperAdmin()
  }
  setAccess()
}
