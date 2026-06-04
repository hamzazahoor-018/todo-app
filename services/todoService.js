const Todo = require('../models/Todo');

const getTodosByUser = (userId) => {
    return Todo.find({ userId }).sort({ createdAt: -1 });
};

const createTodo = (userId, item) => {
    return Todo.create({ item, userId });
};

const updateTodo = (userId, todoId, item) => {
    return Todo.findOneAndUpdate(
        { _id: todoId, userId },
        { item },
        { new: true }
    );
};

const deleteTodo = (userId, todoId) => {
    return Todo.findOneAndDelete({ _id: todoId, userId });
};

module.exports = {
    getTodosByUser,
    createTodo,
    updateTodo,
    deleteTodo
};
