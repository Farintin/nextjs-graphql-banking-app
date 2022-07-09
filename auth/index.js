import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'



const Auth = async (context, userModel) => {
    const headers = context.req.headers
    if (context.req.headers['authorization']) {
        const authHeader = headers.authorization
        if (authHeader) {
            const token = authHeader.split('Bearer')[1]
            if (token) {
                try {
                    const authUserId = jwt.verify(token, process.env.JWT_SECRET)
                    return userModel.findById(authUserId, async (err, doc) => {
                        if (err) {
                            throw new AuthenticationError('invalid user authorization')
                        }
                        return doc
                    })
                } catch (err) {
                    throw new AuthenticationError('Invalid/Expired token')
                }
            }
            throw new Error('Authentication token must be "Bearer [token]"')
        }
        throw new Error('Authorization must be provided')
    }
    throw new Error('Authorization header required')
}



module.exports = { Auth }