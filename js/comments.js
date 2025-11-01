class CommentManager {
    constructor(router) {
        this.router = router;
        window.commentManager = this;
    }

    renderComments() {
        const content = document.getElementById('content');
        const currentPostId = StorageManager.getCurrentPost();
        
        content.innerHTML = '<div class="loading">Загрузка комментариев...</div>';

        Promise.all([
            this.router.fetchData('https://jsonplaceholder.typicode.com/comments'),
            this.router.fetchData('https://jsonplaceholder.typicode.com/posts')
        ]).then(([comments, posts]) => {
            const currentPost = posts.find(p => p.id === currentPostId);
            const postComments = comments.filter(comment => comment.postId === currentPostId);

            const filteredComments = this.router.searchTerm ? 
                postComments.filter(comment => 
                    comment.name.toLowerCase().includes(this.router.searchTerm.toLowerCase()) ||
                    comment.body.toLowerCase().includes(this.router.searchTerm.toLowerCase())
                ) : postComments;

            this.renderCommentsHTML(filteredComments, currentPost);
        }).catch(error => {
            content.innerHTML = `<div class="error">Ошибка загрузки комментариев: ${error.message}</div>`;
        });
    }

    renderCommentsHTML(comments, currentPost) {
        let html = `
            <div class="view-header">
                <h2>Комментарии к посту</h2>
            </div>
            
            <div class="post-preview">
                <h3>${currentPost?.title || 'Пост не найден'}</h3>
                <p>${currentPost?.body || ''}</p>
            </div>
            
            <div class="comments-header">
                <h3>Комментарии (${comments.length})</h3>
            </div>
        `;

        if (comments.length === 0) {
            html += '<div class="no-data">Комментарии не найдены</div>';
        } else {
            html += '<div class="comments-list">';
            comments.forEach(comment => {
                html += `
                    <div class="comment-card">
                        <div class="comment-header">
                            <strong class="comment-name">${comment.name}</strong>
                            <span class="comment-email">${comment.email}</span>
                        </div>
                        <div class="comment-body">${comment.body}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        document.getElementById('content').innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CommentManager(app.router);
});
