class PostManager {
    constructor(router) {
        this.router = router;
        window.postManager = this;
    }

    renderPosts() {
        const content = document.getElementById('content');
        const currentUserId = StorageManager.getCurrentUser();
        
        content.innerHTML = '<div class="loading">Загрузка постов...</div>';

        Promise.all([
            this.router.fetchData('https://jsonplaceholder.typicode.com/posts'),
            this.router.fetchData('https://jsonplaceholder.typicode.com/users')
        ]).then(([posts, users]) => {
            const currentUser = users.find(u => u.id === currentUserId);
            const userPosts = posts.filter(post => post.userId === currentUserId);

            const filteredPosts = this.router.searchTerm ? 
                userPosts.filter(post => 
                    post.title.toLowerCase().includes(this.router.searchTerm.toLowerCase()) ||
                    post.body.toLowerCase().includes(this.router.searchTerm.toLowerCase())
                ) : userPosts;

            this.renderPostsHTML(filteredPosts, currentUser);
        }).catch(error => {
            content.innerHTML = `<div class="error">Ошибка загрузки постов: ${error.message}</div>`;
        });
    }

    renderPostsHTML(posts, currentUser) {
        let html = `
            <div class="view-header">
                <h2>Посты пользователя: ${currentUser?.name || 'Неизвестный'} (${posts.length})</h2>
            </div>
        `;

        if (posts.length === 0) {
            html += '<div class="no-data">Посты не найдены</div>';
        } else {
            html += '<div class="posts-grid">';
            posts.forEach(post => {
                html += `
                    <div class="post-card">
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-body">${post.body}</p>
                        <div class="post-actions">
                            <a href="#users#posts#comments" class="btn-link" onclick="StorageManager.setCurrentPost(${post.id})">
                                Комментарии
                            </a>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        document.getElementById('content').innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PostManager(app.router);
});
