import mongoose from 'mongoose'



const Schema = mongoose.Schema

const WalletSchema = new Schema({
      number: {
        type: String,
        required: true,
        maxlength: 10,
        unique: true,
        trim: true
      },
      balance: {
        type: Number,
        default: 0
      },
      customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
      }
  },
  {
      timestamps: true
  }
)

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema)



export default Wallet