const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const todoValidator = require('../validators/todoValidator');
const validate = require('../middlewares/validate');

router.get('/', todoController.getTodos);
router.post(
    '/',
    ...todoValidator.createTodoValidation,
    validate,
    todoController.createTodo
);
router.put(
    '/:id',
    ...todoValidator.updateTodoValidation,
    validate,
    todoController.updateTodo
);
router.delete(
    '/:id',
    ...todoValidator.deleteTodoValidation,
    validate,
    todoController.deleteTodo
);

module.exports = router;
