import express from 'express'
import container from '../inversify.config'
import { SuperAdminController } from '../controller/super-admin-controller'
import { TYPES } from '../TYPES'

const router=express.Router()
const superAdminController=container.get<SuperAdminController>(TYPES.SuperAdminController)

router.post('/login', superAdminController.login)

export default router