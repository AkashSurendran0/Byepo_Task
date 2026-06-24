import express from 'express'
import container from '../inversify.config'
import { SuperAdminController } from '../controller/super-admin-controller'
import { OrganizationController } from '../controller/organization-controller'
import { TYPES } from '../TYPES'
import { requireAuth } from '../middleware/auth-middleware'

const router=express.Router()
const superAdminController=container.get<SuperAdminController>(TYPES.SuperAdminController)
const organizationController=container.get<OrganizationController>(TYPES.OrganizationController)

router.post('/login', superAdminController.login)
router.get('/organizations', requireAuth('super_admin'), organizationController.listForSuperAdmin)
router.post('/organizations', requireAuth('super_admin'), organizationController.create)

export default router
