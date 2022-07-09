import mongoose from 'mongoose'



const Schema = mongoose.Schema

const AdminSchema = new Schema({
      firstname: {
        type: String,
        required: [true, 'Please provide your firstname.'],
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
      email: {
        type: String,
        required: [true, 'email number required'],
        unique: true,
        trim: true
      },
      passcode: {
        type: String,
        required: [true, 'passcode required.'],
        trim: true
      },
      role: {
        type: String,
        required: true,
        enum: {
          values: ['superadmin', 'admin'],
          message: '{VALUE} is not supported'
        }
      }
  },
  {
      timestamps: true
  }
)

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)



export default Admin