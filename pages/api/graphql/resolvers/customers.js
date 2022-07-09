import Customer from '../../../../db/models/Customer'
import Wallet from '../../../../db/models/Wallet'
import Transaction from '../../../../db/models/Transaction'

import { AuthenticationError } from 'apollo-server'
import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//import { generateAccNo } from '../../../../func/generator'



function generateAccNo() {
    return Math.floor(Math.random(0,10) * 100000000000).toString()
}



const resolvers = {
    Query: {
        customer: async (parent, args, context) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }

            const res = await Customer.findById(authUserId)
            if (!res) {
                throw new AuthenticationError('invalid user authorization')
            }

            console.log(`res: ${res}`)
            return res
        }
    },
    Mutation: {
        customerSignup: async (_, {customerSignupInput: {firstname, lastname, phone, passcode} }) => {
            const oldCustomer = await Customer.findOne({ phone })
            if (oldCustomer) {
                throw new ApolloError('customer phone number already exist', 'CUSTOMER_ALREADY_EXIST')
            }

            const encryptedPasscode = await bcrypt.hash(passcode, 10)

            const newCustomer = new Customer({
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                passcode: encryptedPasscode
            })

            let checkedAccNos = []
            let wallet
            let walletWithNo = true
            let accNo
            while(walletWithNo) {
                accNo = generateAccNo()
                if (!checkedAccNos.includes(accNo)) {
                    wallet = await Wallet.findOne({number: accNo})
                    if (!wallet) {
                        walletWithNo = false
                    } else {
                        checkedAccNos.push(accNo)
                    }
                }
            }
            console.log(`accNo: ${accNo}`)
            
            wallet = new Wallet({number: accNo})
            const walletDoc = await wallet.save()
            newCustomer.wallets.push(walletDoc._id)
            const customerDoc = await newCustomer.save()

            return {
                id: customerDoc.id,
                ...customerDoc._doc
            }
        },
        customerLogin: async (_, {customerLoginInput: {phone, passcode} }) => {
            //console.log(`context.userId: ${context.userId}`)
            const customer = await Customer.findOne({ phone })
            if (customer && (await bcrypt.compare(passcode, customer.passcode))) {
                const token = jwt.sign(
                    {
                        sub: customer.id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h'
                    }
                )
    
                customer.token = token
    
                const res = await customer.save()
    
                return {
                    id: res.id,
                    ...res._doc,
                    token: token
                }
            }
            throw new ApolloError('Invalid username or password', 'INVALID LOGIN')
        },
        /*deposit: async (_, {depositInput: { amount, toWalletNo }}) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }

            return Customer.findById(authUserId, async (err, customer) => {
                if (err) {
                    throw new AuthenticationError('invalid user authorization')
                }

                const wallet = await Wallet.findOne({number: toWalletNo});
                if (wallet && wallet.Customer === customer.id) {
                    const increasedBalance = wallet.balance + amount
                    await Wallet.findByIdAndUpdate(wallet.id, {balance: increasedBalance})
                    const transaction = new Transaction({ ...depositInput, type: 'deposit', toWalletNo: wallet.number })
                    await transaction.save()

                    return 'transaction sucessful'
                }

                throw new ApolloError('Invalid Wallet access', 'INVALID')
            })
        },
        withdraw: async (_, {withdrawInput: { amount, fromWalletNo }}) => {
            const authUserId = context.userId
            if (authUserId === null) {
                throw new AuthenticationError('Invalid/Expired token')
            }

            return Customer.findById(authUserId, async (err, customer) => {
                if (err) {
                    throw new AuthenticationError('invalid user authorization')
                }

                const wallet = await Wallet.findOne({number: toWalletNo});
                if (wallet && wallet.Customer === customer.id) {
                    const balance = wallet.balance
                    if (balance >= amount) {
                        const decreasedBalance = balance - amount
                        await Wallet.findByIdAndUpdate(wallet.id, {balance: decreasedBalance})
                        const transaction = new Transaction({ ...depositInput, type: 'withdrawal', toWalletNo: wallet.number })
                        await transaction.save()

                        return 'transaction sucessful'
                    }

                    throw new ApolloError('Insuficient balance', 'LIMIT')
                }

                throw new ApolloError('Invalid Wallet access', 'INVALID')
            })
        }*/
    }
}



export default resolvers