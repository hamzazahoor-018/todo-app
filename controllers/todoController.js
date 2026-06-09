const todoService = require('../services/todoService');
const AppError = require('../utils/AppError');

const getTodos = async (req, res) => {
  const todos = await todoService.getTodosByUser(req.user.userId);

  res.status(200).json({
    success: true,
    data: todos
  });
};

const createTodo = async (req, res) => {
  const todo = await todoService.createTodo(req.user.userId, req.body.item);

  res.status(201).json({
    success: true,
    message: 'Todo created successfully',
    data: todo
  });
};

const updateTodo = async (req, res) => {
  const updatedTodo = await todoService.updateTodo(req.user.userId, req.params.id, req.body.item);

  if (!updatedTodo) {
    throw new AppError(404, 'Todo not found');
  }

  res.status(200).json({
    success: true,
    message: 'Todo updated successfully',
    data: updatedTodo
  });
};

const deleteTodo = async (req, res) => {
  const deletedTodo = await todoService.deleteTodo(req.user.userId, req.params.id);

  if (!deletedTodo) {
    throw new AppError(404, 'Todo not found');
  }

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
