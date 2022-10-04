import express from 'express';
import mongoose from 'mongoose'; 
import userRouters from './routers/userRouter.js'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

const app = express();

dotenv.config()

mongoose.connect(process.env.MONGODB_URL, {}).then(
    console.log(`MongoDB Connected `)
)

const port = process.env.PORT || 4000

app.use(bodyParser.json())

// app.use('*', (req, res))

app.use('/users', userRouters)

app.listen(port, () => {
    console.log(`Port: ${port}`)
})