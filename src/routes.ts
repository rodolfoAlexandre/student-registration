import express from 'express'
import { studentsController } from './controllers/students-contoller'
import { setError } from './middlewares/error'

const router = express.Router()

router.get('/healthCheck', (req, res) => res.json({ status: 'OK'}))

router.get('/students', studentsController.index, setError)
router.get('/students/:cpf', studentsController.show, setError)
router.post('/students', studentsController.save, setError)
router.patch('/students/:cpf', studentsController.update, setError)
router.delete('/students/:cpf', studentsController.delete, setError)

export { router }