const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {
  invoices,
  customers,
  revenues,
  users,
  countries,
  provinces,
  cities,
} = require('./lib/seed-data.js')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const hash = async (input) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(input, salt)
}

async function seedUsers() {
  try {
    const userSchema = new Schema(
      {
        firstName: String,
        lastName: String,
        roles: [String],
        email: { type: String, unique: true },
        emailVerified: { type: Boolean, default: true },
        mobile: {
          type: String,
          default: null, // می‌تونه null باشه
          trim: true,
        },
        mobileVerified: { type: Boolean, default: true },
        password: { type: String, required: true },
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )

    userSchema.pre('save', async function (next) {
      if (this.isModified('password')) {
        this.password = await hash(this.password)
      }
      next()
    })

    const UserModel = mongoose.model('user', userSchema)
    // Insert data into the "users" table
    const result = await Promise.all(
      users.map(async (user) => {
        console.log(user)
        return UserModel.create({ ...user })
      })
    )
  } catch (error) {
    console.error('Error seeding users:', error)
    // throw error;
  }
}

async function seedInvoices() {
  try {
    const invoiceSchema = new Schema(
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'role',
          required: true,
        },
        amount: { type: Number },
        status: { type: String, enum: ['pending', 'paid'] },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )

    const InvoiceModel = mongoose.model('invoice', invoiceSchema)
    // Insert data into the "users" table
    const result = await Promise.all(
      invoices.map(async (invoice) => {
        console.log(invoice)
        return InvoiceModel.create({ ...invoice })
      })
    )
  } catch (error) {
    console.error('Error seeding users:', error)
    // throw error;
  }
}

async function seedCustomers() {
  try {
    const customerSchema = new Schema(
      {
        id: { type: String, unique: true },
        name: { type: String, unique: true },
        email: { type: String, unique: true },
        image_url: { type: String, required: true },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )

    const CustomerModel = mongoose.model('customer', customerSchema)
    // Insert data into the "users" table
    const result = await Promise.all(
      customers.map(async (customer) => {
        console.log(customer)
        return CustomerModel.create({ ...customer })
      })
    )
  } catch (error) {
    console.error('Error seeding users:', error)
    // throw error;
  }
}

async function seedRevenue() {
  try {
    const revenueSchema = new Schema(
      {
        month: { type: String },
        revenue: { type: Number },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )

    const RevenueModel = mongoose.model('revenue', revenueSchema)
    // Insert data into the "users" table
    const result = await Promise.all(
      revenues.map(async (revenue) => {
        console.log(revenue)
        return RevenueModel.create({ ...revenue })
      })
    )
  } catch (error) {
    console.error('Error seeding users:', error)
    // throw error;
  }
}

async function seedCountries() {
  try {
    const countrySchema = new Schema(
      {
        name: {
          type: String,
          required: true,
        },
        name_fa: { type: String, default: '' },
        code: { type: String, default: '' },
        image: { type: Schema.Types.ObjectId, ref: 'file' },
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
    const model = mongoose.model('country', countrySchema)
    // Insert data into the "cities" table
    const result = await Promise.all(
      countries.map(async (country) => {
        console.log(country)
        return model.create({ _id: country.id, ...country })
      })
    )
  } catch (error) {
    console.error('Error seeding countries:', error)
    // throw error;
  }
}
async function seedProvinces() {
  try {
    const provinceSchema = new Schema(
      {
        countryId: {
          type: Schema.Types.ObjectId,
          ref: 'country',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, default: '' },
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
    const model = mongoose.model('province', provinceSchema)
    // Insert data into the "cities" table
    const result = await Promise.all(
      provinces.map(async (item) => {
        return model.create({ _id: item.id, ...item })
      })
    )
  } catch (error) {
    console.error('Error seeding provinces:', error)
    // throw error;
  }
}
async function seedCities() {
  try {
    const citySchema = new Schema(
      {
        countryId: {
          type: Schema.Types.ObjectId,
          ref: 'country',
          required: true,
        },
        provinceId: {
          type: Schema.Types.ObjectId,
          ref: 'province',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, default: '' },
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
    const model = mongoose.model('city', citySchema)
    // Insert data into the "cities" table
    const result = await Promise.all(
      cities.map(async (item) => {
        return model.create({ _id: item.id, ...item })
      })
    )
  } catch (error) {
    console.error('Error seeding cities:', error)
    // throw error;
  }
}

/**
 * Connects to MongoDB and seeds users.
 */
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)

    // Seed users
    await seedUsers()
    // await seedCustomers();
    // await seedInvoices();
    // await seedRevenue();

    // seed places
    await seedCountries()
    await seedProvinces()
    await seedCities()

    mongoose.disconnect()
  } catch (err) {
    console.log(err)
  }
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
