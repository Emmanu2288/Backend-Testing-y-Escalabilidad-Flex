import { Router } from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserDocument
} from '../controllers/users.controller.js'
import upload from '../middlewares/upload.middleware.js'

const router = Router()

router.post('/', createUser)
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/:id/documents', upload.single('document'), uploadUserDocument)

export default router