
module.exports = function(app, Todo){

    //now write all the routes here related to todo list
    app.get('/todo', (req, res) => {
        Todo.find({}).then(todos => {
            res.render('todo', {todos});
        });
    });
    
    app.post('/todo', (req, res) => {
        // logic to create a new todo
        const item = typeof req.body.item === 'string' ? req.body.item.trim() : '';
        if (!item) {
            return res.status(400).send('Todo item is required');
        }

        const newTodo = new Todo({ item });
        newTodo.save()
            .then(() => res.redirect('/todo'))
            .catch(err => res.status(500).send(err.message));
    });

    app.put('/todo/:id', (req, res) => {
        res.send(`Update todo with id ${req.params.id}`);
    });
    
    app.delete('/todo/:value', async (req, res) => {
            const value = decodeURIComponent(req.params.value);

            try {
                const deletedTodo = await Todo.findByIdAndDelete(value);

                if (deletedTodo) {
                    return res.sendStatus(200);
                }

                const deletedByItem = await Todo.findOneAndDelete({ item: value });

                if (deletedByItem) {
                    return res.sendStatus(200);
                }

                return res.sendStatus(404);
            } catch (err) {
                return res.status(500).send(err.message);
            }
    });

}