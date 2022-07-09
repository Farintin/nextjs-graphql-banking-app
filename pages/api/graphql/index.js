import { ApolloServer } from "apollo-server-micro"
import Cors from "micro-cors"
import typeDefs from "./schema"
import resolvers from "./resolvers"
import connectDB from "../../../db/dbConnect"
import jwt from 'jsonwebtoken'
/*
const cors = Cors({
    allowMethods: ["GET", "POST", "OPTIONS"]
})
*/
const cors = Cors()
const apolloServer = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.split('Bearer ')[1]
            if (!token) {
                return {userId: null}
            }

            try { 
                const payload = jwt.verify(token, process.env.JWT_SECRET)
                const userId = payload.sub

                return {userId: userId}
            } catch (err) {
                return {userId: null}
            }
        }
        return {userId: null}
        //throw new Error('Authentication token must be "Bearer [token]"')
        //throw new Error('Authorization must be provided')
    }
})
const startServer = apolloServer.start()



export default cors(async function handler(req, res) {
    if (req.method == "OPTIONS") {
        res.end()
        return false
    }

    await connectDB()
    await startServer
    await apolloServer.createHandler({ path: "/api/graphql" })(req, res)
})
export const config = {
    api: {
        bodyParser: false
    }
}