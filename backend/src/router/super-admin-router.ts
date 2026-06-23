import express from 'express'
import container from '../inversify.config'
import { SuperAdminController } from '../controller/super-admin-controller'
import { TYPES } from '../TYPES'
import { requireAuth } from '../middleware/auth-middleware'

const router=express.Router()
const superAdminController=container.get<SuperAdminController>(TYPES.SuperAdminController)

router.post('/login', superAdminController.login)
router.get('/organizations', requireAuth('super_admin'), superAdminController.listOrganizations)
router.post('/organizations', requireAuth('super_admin'), superAdminController.createOrganization)

export default router
