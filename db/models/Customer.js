import mongoose from 'mongoose'
import mongooseIntlPhone from 'mongoose-intl-phone-number'



const Schema = mongoose.Schema

const CustomerSchema = new Schema({
      firstname: {
        type: String,
        required: [true, 'Please provide your firstname.'],
        maxlength: [20, 'Name cannot be more than 20 characters'],
        trim: true,
        lowercase: true
      },
      middleName: {
        type: String,
        maxlength: [20, 'Name cannot be more than 20 characters'],
        trim: true,
        lowercase: true
      },
      lastname: {
        type: String,
        required: [true, 'Please provide your lastname.'],
        maxlength: [20, 'Name cannot be more than 20 characters'],
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: [true, 'phone number required'],
        unique: true,
        trim: true
      },
      passcode: {
        type: String,
        required: [true, 'passcode required.'],
        trim: true
      },
      wallets: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Wallet'
        }
      ]
  },
  {
      timestamps: true
  }
)

CustomerSchema.plugin(mongooseIntlPhone, {
  hook: 'validate',
  phoneNumberField: 'phone',
  nationalFormatField: 'phoneNationalFormat',
  internationalFormat: 'phoneInternationalFormat',
  countryCodeField: 'countryCode',
})

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)



export default Customer