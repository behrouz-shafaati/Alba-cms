import mongoose from 'mongoose'
import { Types } from 'mongoose'
import { Id, Pagination, QueryFind, QueryResponse } from './interface'
import dbConnect from '@/lib/dbConnect'

const makeNewJsonObject = (object: any) => {
  return object
  const jsonStringObject = JSON.stringify(object)
  return JSON.parse(jsonStringObject)
}
// a function that recive json object, convert it to json string, the convert to json object and return it
function toObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}
function standardizationFilters(filters: any): any {
  if (typeof filters != 'object') return filters
  for (const [key, value] of Object.entries(filters)) {
    // for id
    if (key == 'id') {
      filters._id = value
      delete filters.id
    }
  }
  return filters
}

const defaultPagination: Pagination = {
  page: 0,
  perPage: 15,
}

export default class service {
  private model: any
  constructor(model: any) {
    this.model = model
  }

  /**
   * Find documents in the MongoDB collection based on specified filters, pagination, and sort order.
   * @param filters - The filters to apply when querying the collection. Default is an empty object.
   * @param pagination - The pagination configuration. Default is a predefined pagination object.
   * @param sort - The sort order for the returned documents. Default is to sort by createdAt field in descending order.
   * @returns A Promise that resolves to a QueryResponse object containing the retrieved documents, pagination information, and total document count.
   */
  async find(
    filters = {},
    pagination: Pagination = defaultPagination,
    sort = { createdAt: -1 },
    options: { projection?: Record<string, 0 | 1> } = {}
  ): Promise<QueryResponse<any>> {
    // Connect to the MongoDB database
    await dbConnect()
    // Standardize and update the filters
    filters = standardizationFilters(filters)
    // Calculate the skip value for pagination
    // The page start from 0
    const page: number = (pagination.page as number) - 1
    let skip: number = page > 0 ? page * pagination.perPage : 0

    // Add deleted:false filter to exclude deleted documents
    filters = { ...filters, deleted: false }
    // Find documents in the collection based on filters, sort order, and pagination
    // Get the total count of documents that match the filters
    const projection = options.projection ?? {}
    const [result, totalDocuments] = await Promise.all([
      this.model
        .find(filters, projection)
        .sort(sort)
        .skip(skip)
        .limit(pagination.perPage),
      this.model.countDocuments(filters),
    ])
    // Disconnect from the MongoDB database
    // mongoose.disconnect();

    // Calculate the next page value for pagination
    let nextPage: number =
      page * pagination.perPage >= totalDocuments ? 0 : page + 1

    // Calculate the total number of pages based on the document count and pagination
    const totalPages: number = Math.ceil(totalDocuments / pagination.perPage)

    // If there are no documents or all documents are returned, set nextPage to 0
    if (!result.length || result.length == totalDocuments) nextPage = 0
    // Return the QueryResponse object with the retrieved documents, pagination information, and total document count
    return toObject({
      data: result,
      nextPage,
      totalPages,
      totalDocuments,
    })
  }

  async findAll(
    filters = {},
    sort = { createdAt: -1 },
    populate?: string,
    options: { projection?: Record<string, 0 | 1> } = {}
  ): Promise<QueryResponse<any>> {
    // Connect to the MongoDB database
    await dbConnect()
    const projection = options.projection ?? {}
    filters = { ...filters, deleted: false }
    let result: any
    if (populate)
      result = await this.model
        .find(filters, projection)
        .populate(populate)
        .sort(sort)
    else result = await this.model.find(filters, projection).sort(sort)

    const totalDocuments: number = await this.model.countDocuments(filters)
    // Disconnect from the MongoDB database
    // mongoose.disconnect();
    let nextPage: number = 0
    const totalPages: number = 1
    return toObject({
      data: result,
      nextPage,
      totalPages,
      totalDocuments,
    })
  }

  async findById(
    _id: string,
    options: { projection?: Record<string, 0 | 1> } = {}
  ) {
    if (!_id || _id == '') return null
    // Connect to the MongoDB database
    await dbConnect()
    const projection = options.projection ?? {}
    return toObject(
      await this.model.findById({ _id, deleted: false }, projection)
    )
  }
  async findOne(filters: object = {}, populate?: string) {
    // Connect to the MongoDB database
    await dbConnect()
    filters = standardizationFilters(filters)
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      }
    }

    if (populate) {
      return await this.model
        .findOne({ ...filters, deleted: false })
        .populate(populate)
    }
    return toObject(await this.model.findOne({ ...filters, deleted: false }))
  }
  async create(data: object) {
    // Connect to the MongoDB database
    await dbConnect()
    const newData = await this.model.create(data)
    return toObject(newData)
    // Disconnect from the MongoDB database
    // mongoose.disconnect();
  }

  /**
   * Find one document based on the given filters and update it with the provided data.
   * @param filters - The filters to search for the document.
   * @param data - The data to update the document with.
   * @returns The updated document.
   */
  async findOneAndUpdate(
    filters: any,
    data: object,
    options: {
      projection?: Record<string, 0 | 1>
      upsert?: boolean
      new?: boolean
      [key: string]: any
    } = {}
  ) {
    // Connect to the MongoDB database
    await dbConnect()
    // Convert string or ObjectId filters to an object if necessary
    filters = standardizationFilters(filters)
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      }
    }
    // Add 'deleted' filter to exclude deleted documents
    filters = { ...filters, deleted: false }
    // Find and update the document, and return the updated document
    console.log('#777 filters in update:', filters)

    //  اگر data خودش شامل عملگرهای MongoDB بود ($set, $inc, $push, ...)
    const hasOperator = Object.keys(data).some((key) => key.startsWith('$'))

    const updatePayload = hasOperator ? data : { $set: data }

    const updatedValue = await this.model.findOneAndUpdate(
      filters,
      updatePayload,
      {
        new: true,
        ...options, //  projection همینجا عبور می‌کند
      }
    )

    return toObject(updatedValue)
  }

  async updateMany(filters: any, data: object, options: object = {}) {
    // Connect to the MongoDB database
    await dbConnect()
    filters = { ...filters, deleted: false }
    return toObject(await this.model.updateMany(filters, data, options))
  }
  async countDocuments(filters: any): Promise<number> {
    // Connect to the MongoDB database
    await dbConnect()
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      }
    }
    filters = { ...filters, deleted: false }
    console.log('count filters:', filters)
    return this.model.countDocuments(filters)
  }

  async delete(ids: Id[]) {
    // Connect to the MongoDB database
    await dbConnect()
    try {
      const result: any = await this.model.updateMany(
        {
          _id: { $in: ids },
        },
        { deleted: true },
        { multi: true }
      )
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async deleteMany(filters: object, fullDelete = false) {
    // Connect to the MongoDB database
    await dbConnect()
    try {
      if (fullDelete) {
        console.log('#872 fullDelete filters:', filters)
        const result: any = await this.model.deleteMany(filters)
        return result
      }
      const result: any = await this.model.updateMany(
        filters,
        { deleted: true },
        { multi: true }
      )
      return result
    } catch (error) {
      console.log('#872 error: ', error)
    }
  }

  async aggregate(query: any[], pagination: Pagination = defaultPagination) {
    // کلون کردن کوئری برای محاسبه تعداد کل مستندات
    const queryToCalculateCount = [...query]
    const pageNumber: number = pagination.page as number

    if (
      pagination.perPage === undefined ||
      pagination.perPage === null ||
      Number.isNaN(pagination.perPage) ||
      typeof pagination.perPage === undefined
    ) {
      pagination.perPage = defaultPagination.perPage
    }

    // محاسبه مقدار skip برای صفحه‌بندی
    const skip: number =
      pageNumber > 0 ? (pageNumber - 1) * pagination.perPage : 0

    // اضافه کردن مراحل skip و limit به کوئری برای صفحه‌بندی
    query.push({ $skip: skip }, { $limit: pagination.perPage })

    // اجرای کوئری اصلی
    const result = await this.model.aggregate(query).allowDiskUse(true)

    // اضافه کردن مراحل project و count به کوئری برای محاسبه تعداد کل مستندات
    queryToCalculateCount.push({ $project: { _id: 1 } }, { $count: 'count' })
    const totalDocument = await this.model
      .aggregate(queryToCalculateCount)
      .allowDiskUse(true)

    // استخراج تعداد کل مستندات
    const countTotalDocument = totalDocument[0] ? totalDocument[0].count : 0

    // محاسبه شماره صفحه بعد و تعداد کل صفحات
    let nextPage: number =
      pageNumber * pagination.perPage >= countTotalDocument ? 0 : pageNumber + 1
    const totalPages: number =
      Math.ceil(countTotalDocument / pagination.perPage) || 0

    // اگر نتیجه خالی باشد یا تعداد نتیجه با تعداد کل مستندات برابر باشد، صفحه بعدی وجود ندارد
    if (!result.length || result.length === countTotalDocument) nextPage = 0

    return {
      result: makeNewJsonObject(result), // تبدیل نتیجه به قالب جدید
      nextPage,
      totalPages,
      totalDocument: countTotalDocument,
    }
  }
}
