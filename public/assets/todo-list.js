document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todoList');
    const todoMessage = document.getElementById('todoMessage');
    const todoSubmitBtn = document.getElementById('todoSubmitBtn');
    const todoCancelBtn = document.getElementById('todoCancelBtn');
    let editingTodoId = null;

    const setMessage = (text, type) => {
        if (!todoMessage) {
            return;
        }

        todoMessage.textContent = text;
        todoMessage.dataset.state = type;
    };

    const escapeHtml = (value) => {
        const span = document.createElement('span');
        span.textContent = value;
        return span.innerHTML;
    };

    const createTodoMarkup = (todo) => {
        return `
            <li class="todo-item" data-id="${todo._id}" data-item="${escapeHtml(todo.item)}">
                <span class="todo-text">${escapeHtml(todo.item)}</span>
                <div class="todo-actions">
                    <button type="button" class="todo-action-btn todo-edit-btn">Edit</button>
                    <button type="button" class="todo-action-btn todo-delete-btn">Delete</button>
                </div>
            </li>
        `;
    };

    const addTodoToList = (todo) => {
        if (!todoList) {
            return;
        }

        todoList.insertAdjacentHTML('afterbegin', createTodoMarkup(todo));
    };

    const setEditMode = (todoId, item) => {
        editingTodoId = todoId;
        if (todoInput) {
            todoInput.value = item;
            todoInput.focus();
            todoInput.setSelectionRange(item.length, item.length);
        }

        if (todoSubmitBtn) {
            todoSubmitBtn.textContent = 'Update';
        }

        if (todoCancelBtn) {
            todoCancelBtn.hidden = false;
        }

        const currentEditing = todoList?.querySelector('.todo-item.is-editing');
        if (currentEditing) {
            currentEditing.classList.remove('is-editing');
        }

        const selectedTodo = todoList?.querySelector(`[data-id="${CSS.escape(todoId)}"]`);
        if (selectedTodo) {
            selectedTodo.classList.add('is-editing');
        }
    };

    const resetEditMode = () => {
        editingTodoId = null;

        if (todoInput) {
            todoInput.value = '';
        }

        if (todoSubmitBtn) {
            todoSubmitBtn.textContent = 'Add';
        }

        if (todoCancelBtn) {
            todoCancelBtn.hidden = true;
        }

        const currentEditing = todoList?.querySelector('.todo-item.is-editing');
        if (currentEditing) {
            currentEditing.classList.remove('is-editing');
        }
    };

    const updateTodoInList = (todoId, updatedItem) => {
        const todoItem = todoList?.querySelector(`[data-id="${CSS.escape(todoId)}"]`);

        if (!todoItem) {
            return;
        }

        todoItem.dataset.item = updatedItem;
        const todoText = todoItem.querySelector('.todo-text');
        if (todoText) {
            todoText.textContent = updatedItem;
        }
    };

    const removeTodoFromList = (todoId) => {
        const todoItem = todoList?.querySelector(`[data-id="${CSS.escape(todoId)}"]`);
        if (todoItem) {
            todoItem.remove();
        }
    };

    if (todoForm) {
        todoForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const item = todoInput?.value.trim();

            if (!item) {
                setMessage('Todo item is required', 'error');
                return;
            }

            const isEditing = Boolean(editingTodoId);
            setMessage(isEditing ? 'Updating todo...' : 'Adding todo...', 'loading');

            try {
                const endpoint = isEditing
                    ? `/todo/${encodeURIComponent(editingTodoId)}`
                    : '/todo';
                const method = isEditing ? 'PUT' : 'POST';

                const response = await fetchWithRefresh(endpoint, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ item })
                });

                const data = await handleFetchResponse(response);

                if (isEditing) {
                    updateTodoInList(editingTodoId, data.data.item);
                    setMessage(data.message || 'Todo updated successfully', 'success');
                } else {
                    addTodoToList(data.data);
                    setMessage(data.message || 'Todo added successfully', 'success');
                }

                resetEditMode();
            } catch (error) {
                setMessage(error.message || 'Something went wrong', 'error');
            }
        });
    }

    if (todoCancelBtn) {
        todoCancelBtn.addEventListener('click', () => {
            resetEditMode();
            setMessage('Edit cancelled', 'loading');
        });
    }

    if (todoList) {
        todoList.addEventListener('click', async (event) => {
            const target = event.target;
            const todoItem = target.closest('.todo-item');

            if (!todoItem) {
                return;
            }

            const todoId = todoItem.dataset.id;
            const currentItem = todoItem.dataset.item || '';

            if (target.classList.contains('todo-delete-btn')) {
                try {
                    const response = await fetchWithRefresh(`/todo/${encodeURIComponent(todoId)}`, {
                        method: 'DELETE'
                    });

                    const data = await handleFetchResponse(response);

                    removeTodoFromList(todoId);

                    if (editingTodoId === todoId) {
                        resetEditMode();
                    }

                    setMessage(data.message || 'Todo deleted successfully', 'success');
                } catch (error) {
                    setMessage(error.message || 'Something went wrong', 'error');
                }
                return;
            }

            if (target.classList.contains('todo-edit-btn')) {
                setEditMode(todoId, currentItem);
                setMessage('Editing todo. Update it from the input field.', 'loading');
            }
        });
    }
});
