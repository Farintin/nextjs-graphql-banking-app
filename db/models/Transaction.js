import mongoose from 'mongoose'



const Schema = mongoose.Schema

const TransactionSchema = new Schema({
      amount: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: {
          values: ['deposit', 'withdrawal'],
          message: '{VALUE} is not supported'
        }
      },
      toWalletNo: {
        type: String,
        maxlength: 10,
        trim: true
      },
      fromWallet: {
        type: String,
        maxlength: 10,
        trim: true
      },
      desc: {
        type: String
      }
  },
  {
      timestamps: true
  }
)

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)



export default Transaction