import { gql } from "apollo-server-micro"



const typeDefs = gql`
    type Customer {
        id: ID!
        firstname: String
        middleName: String
        lastname: String
        phone: String
        passcode: String
        wallets: [Wallet]
        token: String
    }

    type Wallet {
        id: ID!
        number: String
        balance: Int
        customer: Customer!
    }

    type Transaction {
        id: ID!
        amount: Int
        type: String
        fromWallet: Wallet
        toWallet: Wallet
        desc: String
    }



    input CustomerSignupInput {
        firstname: String!
        middleName: String
        lastname: String!
        phone: String!
        passcode: String!
    }
    input CustomerLoginInput {
        phone: String!
        passcode: String!
    }

    

    type Query {
        customer: Customer

        getAllCustomers: [Customer]
        getCustomer(id: ID): Customer
    }

    type Mutation {
        customerSignup(customerSignupInput: CustomerSignupInput): Customer
        customerLogin(customerLoginInput: CustomerLoginInput): Customer
    }
`
/*

    type Admin {
        id: ID!
        firstname: String
        lastname: String
        email: String
        passcode: String
        token: String
    }
    input AdminSignupInput {
        firstname: String!
        lastname: String!
        email: String!
        passcode: String!
        role: String!
    }
    input AdminLoginInput {
        email: String!
        passcode: String!
    }
input DepositInput {
    amount: Int!
    toWalletNo: String!
}
input WithdrawInput {
    amount: Int!
    fromWalletNo: String!
}*/
//adminSignup(adminSignupInput: AdminSignupInput): Admin
//adminLogin(adminLoginInput: AdminLoginInput): Admin
//admin: Admin
//getAllTransactions: [Transaction]
//customersTransactions(customerId: ID): [Transaction]
//deposit(depositInput: DepositInput): String
//withdraw(withdrawInput: WithdrawInput): String



export default typeDefs