import express from 'express'
import 'reflect-metadata'
import dotenv from 'dotenv'
import SuperAdminRouter from './router/super-admin-router'
import OrganizationRouter from './router/organization-router'
import AdminRouter from './router/admin-router'
import UserRouter from './router/user-router'
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
app.use('/organizations', OrganizationRouter)
app.use('/admin', AdminRouter)
app.use('/user', UserRouter)

app.listen(PORT, ()=>{
    console.log(`Backend running on ${PORT}`)
})
