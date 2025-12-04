import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/roles.js';
import { validate } from '../middlewares/validate.js';
import {
  taskValidation,
  statusValidation,
  taskQueryValidation,
} from '../validators/taskValidators.js';

const router = express.Router();

router.use(protect);

router.get('/', taskQueryValidation, validate, getTasks);
router.get('/:id', getTask);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', taskValidation, validate, updateTask);
router.patch('/:id/status', statusValidation, validate, toggleTaskStatus);
router.delete('/:id', isAdmin, deleteTask);

export default router;
