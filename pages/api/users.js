import connectDatabase from '../../util/dbConnect'
import User from '../../models/User'
import Payload from '../../handler/payload'



export default async function handler(req, res) {
  await connectDatabase()
  const { method } = req
  let payload

  switch (method) {
    case 'GET':
      const users = await User.find({})

      payload = new Payload()
      payload.message.data = users
      payload.successMode()

      res.json(payload.emit())
      break
    case 'POST':
      const body = req.body
      const user = await User.create(body)

      payload = new Payload()
      payload.message.data = user
      payload.successMode()

      res.json(payload.emit())
      break
    default:
      payload = new Payload()
      
      res.json(payload.emit())
      break
  }
}