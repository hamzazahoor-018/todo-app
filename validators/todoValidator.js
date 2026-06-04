const { body, param } = require('express-validator');

const todoItemValidation = [
    body('item')
        .trim()
        .notEmpty()
        .withMessage('Todo item is required')
        .isLength({ max: 200 })
        .withMessage('Todo item cannot exceed 200 characters')
];

const todoIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid todo id')
];

const createTodoValidation = [
    ...todoItemValidation
];

const updateTodoValidation = [
    ...todoIdValidation,
    ...todoItemValidation
];

const deleteTodoValidation = [
    ...todoIdValidation
];

module.exports = {
    createTodoValidation,
    updateTodoValidation,
    deleteTodoValidation
};
