import Admin from '../../../../db/models/Admin'
import Customer from '../../../../db/models/Customer'
import Transaction from '../../../../db/models/Transaction'

import { AuthenticationError } from 'apollo-server'
import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'




const resolvers = {
    Query: {
        admin: async (parent, args, context) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }
            const res = await Admin.findById(authUserId)
            if (!res) {
                throw new AuthenticationError('invalid user authorization')
            }

            return res
        },

        getAllCustomers: async (parent, args, context) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }
            const res = await Admin.findById(authUserId)
            if (!res) {
                throw new AuthenticationError('invalid user authorization')
            }
            
            return await Customer.find({})
        },
        getCustomer: async (parent, args, context) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }
            const res = await Admin.findById(authUserId)
            if (!res) {
                throw new AuthenticationError('invalid user authorization')
            }
            
            return await Customer.findById(ID)
        },
        
        /*getAllTransactions: async (parent, args, context) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }

            return Admin.findById(authUserId, async (err) => {
                if (err) {
                    throw new AuthenticationError('invalid user authorization')
                }

                return await Transaction.find({})
            })
        },*/
    },
    Mutation: {
        adminSignup: async (_, {adminSignupInput: { firstname, lastname, email, passcode, role } }) => {
            const oldUser = await Admin.findOne({ email })
            if (oldUser) {
                throw new ApolloError('user email already exist', 'User_ALREADY_EXIST')
            }

            const encryptedPasscode = await bcrypt.hash(passcode, 10)

            const newAdmin = new Admin({
                firstname: firstname,
                lastname: lastname,
                email: email,
                passcode: encryptedPasscode,
                role: role
            })

            const res = await newAdmin.save()

            return {
                id: res.id,
                ...res._doc
            }
        },
        adminLogin: async (_, {adminLoginInput: { email, passcode } }) => {
            const admin = await Admin.findOne({ email })
            if (admin && (await bcrypt.compare(passcode, admin.passcode))) {
                const token = jwt.sign(
                    { userId: admin._id, phone },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h'
                    }
                )
    
                admin.token = token
    
                const res = await admin.save()
    
                return {
                    id: res.id,
                    ...res._doc,
                    token: token
                }
            }

            throw new ApolloError('Invalid username or password', 'INVALID LOGIN')
        }
    }
}



export default resolvers