
module.exports = function(app, Todo) {
    app.get('/todo', async (req, res) => {
        try {
            const todos = await Todo.find({ userId: req.user.userId }).sort({ createdAt: -1 });
            res.render('todo', { todos });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.post('/todo', async (req, res) => {
        try {
            const item = typeof req.body.item === 'string' ? req.body.item.trim() : '';

            if (!item) {
                return res.status(400).json({
                    success: false,
                    message: 'Todo item is required'
                });
            }

            const todo = await Todo.create({
                item,
                userId: req.user.userId
            });

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
    });

    app.put('/todo/:id', async (req, res) => {
        try {
            const item = typeof req.body.item === 'string' ? req.body.item.trim() : '';

            if (!item) {
                return res.status(400).json({
                    success: false,
                    message: 'Todo item is required'
                });
            }

            const updatedTodo = await Todo.findOneAndUpdate(
                { _id: req.params.id, userId: req.user.userId },
                { item },
                { new: true }
            );

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
    });

    app.delete('/todo/:id', async (req, res) => {
        try {
            const deletedTodo = await Todo.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.userId
            });

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
    });
};