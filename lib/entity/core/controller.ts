// import { IAction } from "../entity/action/interface";
// import { Log, LogPayload } from "../entity/log/interface";
// import log from "@entity/log/controller";
import { Session } from '@/types'
import {
  Create,
  QueryFind,
  QueryFindById,
  QueryFindOne,
  Pagination,
  QueryResponse,
  Update,
  Delete,
  DeleteMany,
  AggregateQueryArray,
  QueryResult,
} from './interface'
// import logController from "@entity/log/controller";
import { Types } from 'mongoose'
import { getSession } from '@/middleware'
// import { logEvents } from "@/middleware/logEvents";
// import getPaginationFiltersFromQuery from "@/utils/getPagenationFiltersFromQuery";

export default class controller {
  private service: any
  // private log: ILog;
  /**
   * constructor function for baseController.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param service - The service of the desired entity
   *
   * @beta
   */
  constructor(service: any) {
    this.service = service
  }
  /**
   * Returns the model as an object.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param filters - The filters to find models
   * @returns the desired entity model as an object
   *
   * @beta
   */
  async find(payload: QueryFind): Promise<QueryResult> {
    payload = { saveLog: false, filters: {}, ...payload }
    console.log('#7777 find payload values: ', payload)
    if (payload.filters?.orderBy) {
      payload.sort = {}
      const order = payload.filters?.order === 'asc' ? 1 : -1
      payload.sort[payload.filters?.orderBy] = order
    }
    delete payload.filters?.orderBy
    delete payload.filters?.order

    let result: any
    // log.setVariables(payload);
    if (payload?.pagination)
      if (payload?.pagination.page === 'off') {
        const { pagination, ..._other } = payload
        return this.findAll(_other)
      }
    try {
      result = await this.service.find(
        payload.filters,
        payload.pagination,
        payload.sort,
        { projection: payload.projection ?? {} }
      )
      // if (payload.saveLog) {
      //   if (result) {
      //     log.setTarget(result.id);
      //     log.setResultStatus(true);
      //   } else {
      //     log.setResultStatus(false);
      //   }
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Returns the model as an object.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param filters - The filters to find models
   * @returns the desired entity model as an object
   *
   * @beta
   */
  async findAll(payload: QueryFind): Promise<QueryResponse<any>> {
    payload = { saveLog: false, populate: '', filters: {}, ...payload }
    let result: any
    // log.setVariables(payload);
    try {
      result = await this.service.findAll(
        payload.filters,
        payload.sort,
        payload.populate,
        { projection: payload.projection ?? {} }
      )
      // if (payload.saveLog) {
      //   if (result) {
      //     log.setTarget(result.id);
      //     log.setResultStatus(true);
      //   } else {
      //     log.setResultStatus(false);
      //   }
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Returns the model as an object.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param id - The string id of the model
   * @returns the desired entity model as an object
   *
   * @beta
   */
  async findById(payload: QueryFindById) {
    payload = { saveLog: false, ...payload }
    let result: any
    // if (payload.saveLog) {
    //   log.setVariables({ id: payload.id });
    //   log.setTarget(payload.id);
    // }
    try {
      result = await this.service.findById(payload.id, {
        projection: payload.projection ?? {},
      })
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Search for an entity with specific attributes
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param filters - The object with attributes for search
   * @returnsThe first existing model that matches filters as an object
   *
   * @beta
   */
  async findOne(payload: QueryFindOne) {
    payload = { saveLog: false, populate: '', ...payload }
    let result: any
    // if (payload.saveLog) {
    //   if (typeof payload.filters !== "object") {
    //     log.setTarget(payload.filters as Types.ObjectId);
    //   }
    //   log.setVariables(payload);
    // }
    try {
      result = await this.service.findOne(payload.filters, payload.populate)
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Returns the new created model as an object.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param payload - The initialize data of the desired entity that you want create it
   * @returns the new created desired entity model as an object
   *
   * @beta
   */
  async create(payload: Create): Promise<any> {
    const session = (await getSession()) as Session
    const user = payload.params?.user || session?.user.id || null
    payload = { saveLog: false, ...payload }

    // log.setVariables(payload);
    let result: any
    try {
      result = await this.service.create({ ...payload.params, user })
      // if (payload.saveLog) {
      //   if (result) {
      //     log.setTarget(result.id);
      //     log.setResultStatus(true);
      //   } else {
      //     log.setResultStatus(false);
      //   }
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
      // logEvents(JSON.stringify(error), "mongoErr.log");
      throw new Error('Error in save data.')
    }
    return result
  }
  /**
   * Update one object.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param filters - filter can be Id object or fields to do serach and find one object
   * @param data - The data that we want update
   * @returns Updated object
   *
   * @beta
   */
  async findOneAndUpdate(payload: Update) {
    payload = { saveLog: false, options: {}, ...payload }
    let result: any
    // const previousValues = await this.service.findOne({
    //   filters: payload.filters,
    // })
    // if (payload.saveLog) {
    //   if (typeof payload.filters === "string" || payload.filters === "number") {
    //     log.setTarget(payload.filters);
    //   }
    //   log.setVariables(payload);
    //   log.setPreviousValues(previousValues);
    // }
    try {
      result = await this.service.findOneAndUpdate(
        payload.filters,
        payload.params,
        payload.options
      )
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Update many objects.
   *
   * @remarks
   * This method is part of the main parent class baseController.
   *
   * @param filters - filter can be Id objects or fields to do serach and find one objects
   * @param data - The data that we want update
   * @returns Updated objects
   *
   * @beta
   */
  async updateMany(payload: Update) {
    payload = { saveLog: false, ...payload }
    let result: any
    // const previousValues = await this.service.findAll({
    //   filters: payload.filters,
    // })
    // if (payload.saveLog) {
    //   log.setVariables(payload);
    //   log.setPreviousValues(previousValues);
    // }
    try {
      result = await this.service.updateMany(payload.filters, payload.params)
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }
  /**
   * Returns the total of documents.
   *
   * @remarks
   * The result does not include deleted documents.
   *
   * @returns The count of documents.
   *
   * @beta
   */
  async countAll(filters: any = {}): Promise<number> {
    return this.service.countDocuments({ ...filters, deleted: false })
  }

  async delete(payload: Delete) {
    payload = { saveLog: false, ...payload }
    let result: any
    // if (payload.saveLog) {
    //   log.setVariables(payload);
    // }
    try {
      result = await this.service.delete(payload.filters)
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }

  async deleteMany(payload: DeleteMany, fullDelete: boolean = false) {
    payload = { saveLog: false, ...payload }
    let result: any
    // if (payload.saveLog) {
    //   log.setVariables(payload);
    // }
    try {
      result = await this.service.deleteMany(payload.filters, fullDelete)
      // if (payload.saveLog) {
      //   if (result) log.setResultStatus(true);
      //   else log.setResultStatus(false);
      //   log.save();
      // }
    } catch (error: any) {
      console.log(error)
    }
    return result
  }

  async aggregate(query: AggregateQueryArray, pagination?: Pagination) {
    return this.service.aggregate(query, pagination)
  }
}
