class UserManager {
    constructor(router) {
        this.router = router;
        window.userManager = this;
    }

    renderUsers() {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading">Загрузка пользователей...</div>';

        this.router.fetchData('https://jsonplaceholder.typicode.com/users')
            .then(users => {
                const localUsers = StorageManager.getLocalUsers();
                const allUsers = [...users, ...localUsers];
                
                const filteredUsers = this.router.searchTerm ? 
                    allUsers.filter(user => 
                        user.name.toLowerCase().includes(this.router.searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(this.router.searchTerm.toLowerCase())
                    ) : allUsers;

                this.renderUsersHTML(filteredUsers);
            })
            .catch(error => {
                content.innerHTML = `<div class="error">Ошибка загрузки пользователей: ${error.message}</div>`;
            });
    }

    renderUsersHTML(users) {
        let html = `
            <div class="view-header">
                <h2>Пользователи (${users.length})</h2>
                <button class="btn btn-primary" onclick="userManager.showAddUserForm()">Добавить пользователя</button>
            </div>
        `;

        if (users.length === 0) {
            html += '<div class="no-data">Пользователи не найдены</div>';
        } else {
            html += '<div class="users-grid">';
            users.forEach(user => {
                const isLocalUser = user.id > 10;
                html += `
                    <div class="user-card">
                        <div class="user-header">
                            <h3>${user.name}</h3>
                            ${isLocalUser ? `<button class="btn-delete" onclick="userManager.deleteUser(${user.id})">×</button>` : ''}
                        </div>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Телефон:</strong> ${user.phone}</p>
                        <p><strong>Город:</strong> ${user.address?.city || 'Не указан'}</p>
                        <div class="user-actions">
                            <a href="#users#todos" class="btn-link" onclick="StorageManager.setCurrentUser(${user.id})">Todo</a>
                            <a href="#users#posts" class="btn-link" onclick="StorageManager.setCurrentUser(${user.id})">Посты</a>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        document.getElementById('content').innerHTML = html;
    }

    showAddUserForm() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="form-container">
                <h2>Добавить пользователя</h2>
                <form id="addUserForm" onsubmit="userManager.handleAddUser(event)">
                    <div class="form-group">
                        <label>Имя:</label>
                        <input type="text" name="name" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Телефон:</label>
                        <input type="text" name="phone" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Город:</label>
                        <input type="text" name="city" class="form-input">
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="userManager.renderUsers()" class="btn btn-secondary">Отмена</button>
                        <button type="submit" class="btn btn-primary">Добавить</button>
                    </div>
                </form>
            </div>
        `;
    }

    handleAddUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const localUsers = StorageManager.getLocalUsers();
        const newUser = {
            id: Math.max(0, ...localUsers.map(u => u.id)) + 1,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            address: {
                city: formData.get('city') || ''
            }
        };

        localUsers.push(newUser);
        StorageManager.setLocalUsers(localUsers);
        this.showNotification('Пользователь успешно добавлен');
        this.renderUsers();
    }

    deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            const localUsers = StorageManager.getLocalUsers().filter(user => user.id !== userId);
            StorageManager.setLocalUsers(localUsers);
            this.renderUsers();
        }
    }

    showNotification(message) {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserManager(app.router);
});