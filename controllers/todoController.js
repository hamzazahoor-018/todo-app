const todoService = require('../services/todoService');

const getTodos = async (req, res) => {
    try {
        const todos = await todoService.getTodosByUser(req.user.userId);

        return res.status(200).json({
            success: true,
            data: todos
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch todos',
            error: err.message
        });
    }
};

const createTodo = async (req, res) => {
    try {
        const todo = await todoService.createTodo(req.user.userId, req.body.item);

        return res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: todo
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create todo',
            error: err.message
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        const updatedTodo = await todoService.updateTodo(req.user.userId, req.params.id, req.body.item);

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: updatedTodo
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update todo',
            error: err.message
        });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await todoService.deleteTodo(req.user.userId, req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete todo',
            error: err.message
        });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};
