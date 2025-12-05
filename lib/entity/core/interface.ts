import { Schema, Types } from 'mongoose'

export type {
  Model,
  SchemaModel,
  // IReqDataSources,
  ServerResponse,
  QueryResponse,
  Pagination,
  Create,
  QueryFind,
  QueryFindById,
  QueryFindOne,
  Update,
  Delete,
  DeleteMany,
  QueryResult,
  Location,
  Id,
}

// req contetnt interface
// type ReqDataSources {
//   readonly ip: string;
//   readonly user: IUser;
// }

// All mongoose interfaces extends from this interface
type Model = {
  id: string
  createdAt?: Date
  updatedAt?: Date
}
type SchemaModel = {
  id: Schema.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
  deleted: Boolean
}

// All server response interface
type ServerResponse<T> = {
  ok: number
  message: string
  data: QueryResponse<T>
}

type QueryResponse<T> = {
  data: T[]
  nextPage: number
  totalPages: number
  totalDocuments: number
}

type Pagination = {
  page: number | 'off'
  perPage: number
}

type Log = {
  variables?: any
  successful: boolean
  error: any
}

// DB Query interfaces

type Create = {
  params: any
  saveLog?: boolean
}
type QueryFind = {
  filters?: any & { orderBy?: string; order?: string }
  pagination?: Pagination
  saveLog?: boolean
  sort?: any
  populate?: string
  projection?: Record<string, 0 | 1>
}
type QueryFindById = {
  id: any
  projection?: Record<string, 0 | 1>
  saveLog?: boolean
}
type QueryFindOne = {
  filters: any
  populate?: string
  saveLog?: boolean
}
type Update = {
  filters: any
  params: any
  saveLog?: boolean
  options?: {
    projection?: Record<string, 0 | 1>
    upsert?: boolean
    new?: boolean
    [key: string]: any
  }
}
type Delete = {
  filters: Id[] | string[]
  saveLog?: boolean
}

type DeleteMany = {
  filters: object
  saveLog?: boolean
}

type QueryResult = {
  data: any
  nextPage: number
  totalPages: number
  totalDocuments: number
}

type Location = {
  lat: string
  long: string
}

interface AggregateQuery {
  $match?: { [key: string]: any } // برای فیلتر کردن داده‌ها
  $group?: {
    _id: any
    [key: string]: any
  } // برای گروه‌بندی داده‌ها
  $project?: { [key: string]: any } // برای انتخاب فیلدهای خاص
  $sort?: { [key: string]: 1 | -1 } // برای مرتب‌سازی داده‌ها
  $limit?: number // برای محدود کردن تعداد نتایج
  $skip?: number // برای نادیده گرفتن تعداد مشخصی از نتایج
  $lookup?: {
    from: string
    localField: string
    foreignField: string
    as: string
  } // برای ایجاد ارتباط با مجموعه‌های دیگر
  $unwind?: string | { path: string; preserveNullAndEmptyArrays?: boolean } // برای بازکردن آرایه‌ها
  $addFields?: { [key: string]: any } // برای اضافه کردن فیلدهای جدید
  $replaceRoot?: { newRoot: any } // برای جایگزینی ریشه اسناد
  $count?: string // برای شمارش نتایج
  // می‌توانید سایر مراحل نیز اضافه کنید
}

export interface AggregateQueryArray extends Array<AggregateQuery> {}

type Id = Schema.Types.ObjectId
