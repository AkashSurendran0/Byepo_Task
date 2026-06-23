import express from 'express'
import dotenv from 'dotenv'
import SuperAdminRouter from './router/super-admin-router'
import cors from 'cors'
import { dbConnect } from './infrastructure/database/mongoose'

dbConnect()

dotenv.config()

const app=express()
app.use(cors({
    origin: true,
    credentials: true
}))

const PORT=process.env.PORT

app.use(express.json())

app.use('/super-admin', SuperAdminRouter)

app.listen(PORT, ()=>{
    console.log(`Backend running on ${PORT}`)
})