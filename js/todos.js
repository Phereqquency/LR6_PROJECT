class TodoManager {
    constructor(router) {
        this.router = router;
        window.todoManager = this;
    }

    renderTodos() {
        const content = document.getElementById('content');
        const currentUserId = StorageManager.getCurrentUser();
        
        content.innerHTML = '<div class="loading">Загрузка задач...</div>';

        Promise.all([
            this.router.fetchData('https://jsonplaceholder.typicode.com/todos'),
            this.router.fetchData('https://jsonplaceholder.typicode.com/users')
        ]).then(([todos, users]) => {
            const currentUser = users.find(u => u.id === currentUserId);
            const userTodos = todos.filter(todo => todo.userId === currentUserId);
            
            const localTodos = StorageManager.getLocalTodos();
            const userLocalTodos = localTodos.filter(todo => todo.userId === currentUserId);
            const allTodos = [...userTodos, ...userLocalTodos];

            const filteredTodos = this.router.searchTerm ? 
                allTodos.filter(todo => 
                    todo.title.toLowerCase().includes(this.router.searchTerm.toLowerCase())
                ) : allTodos;

            this.renderTodosHTML(filteredTodos, currentUser);
        }).catch(error => {
            content.innerHTML = `<div class="error">Ошибка загрузки задач: ${error.message}</div>`;
        });
    }

    renderTodosHTML(todos, currentUser) {
        let html = `
            <div class="view-header">
                <h2>Todo пользователя: ${currentUser?.name || 'Неизвестный'} (${todos.length})</h2>
                <button class="btn btn-primary" onclick="todoManager.showAddTodoForm()">Добавить задачу</button>
            </div>
        `;

        if (todos.length === 0) {
            html += '<div class="no-data">Задачи не найдены</div>';
        } else {
            html += '<div class="todos-list">';
            todos.forEach(todo => {
                const isLocalTodo = todo.id > 200;
                html += `
                    <div class="todo-item ${todo.completed ? 'completed' : ''}">
                        <div class="todo-checkbox">
                            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                                   onchange="todoManager.toggleTodo(${todo.id}, ${isLocalTodo})">
                        </div>
                        <div class="todo-content">
                            <div class="todo-title">${todo.title}</div>
                            <div class="todo-meta">
                                ${isLocalTodo ? '<span class="local-badge">Локальная</span>' : ''}
                                ${todo.completed ? '<span class="status-badge completed">Выполнено</span>' : '<span class="status-badge pending">В процессе</span>'}
                            </div>
                        </div>
                        ${isLocalTodo ? `
                            <button class="btn-delete" onclick="todoManager.deleteTodo(${todo.id})">×</button>
                        ` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        document.getElementById('content').innerHTML = html;
    }

    showAddTodoForm() {
        const content = document.getElementById('content');
        const currentUserId = StorageManager.getCurrentUser();
        
        content.innerHTML = `
            <div class="form-container">
                <h2>Добавить задачу</h2>
                <form id="addTodoForm" onsubmit="todoManager.handleAddTodo(event)">
                    <div class="form-group">
                        <label>Задача:</label>
                        <textarea name="title" required class="form-input" rows="3" placeholder="Опишите задачу..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="completed"> Выполнено
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="todoManager.renderTodos()" class="btn btn-secondary">Отмена</button>
                        <button type="submit" class="btn btn-primary">Добавить</button>
                    </div>
                </form>
            </div>
        `;
    }

    handleAddTodo(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const currentUserId = StorageManager.getCurrentUser();
        
        const localTodos = StorageManager.getLocalTodos();
        const newTodo = {
            id: Math.max(0, ...localTodos.map(t => t.id)) + 1,
            userId: currentUserId,
            title: formData.get('title'),
            completed: formData.get('completed') === 'on'
        };

        localTodos.push(newTodo);
        StorageManager.setLocalTodos(localTodos);
        this.showNotification('Задача успешно добавлена');
        this.renderTodos();
    }

    toggleTodo(todoId, isLocal) {
        if (!isLocal) {
            alert('Можно изменять только локальные задачи');
            return;
        }

        const localTodos = StorageManager.getLocalTodos();
        const todoIndex = localTodos.findIndex(t => t.id === todoId);
        
        if (todoIndex !== -1) {
            localTodos[todoIndex].completed = !localTodos[todoIndex].completed;
            StorageManager.setLocalTodos(localTodos);
            this.renderTodos();
        }
    }

    deleteTodo(todoId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            const localTodos = StorageManager.getLocalTodos().filter(todo => todo.id !== todoId);
            StorageManager.setLocalTodos(localTodos);
            this.showNotification('Задача удалена');
            this.renderTodos();
        }
    }

    showNotification(message) {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoManager(app.router);
});