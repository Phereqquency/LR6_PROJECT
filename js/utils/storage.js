class StorageManager {
    static getLocalUsers() {
        return JSON.parse(localStorage.getItem('localUsers') || '[]');
    }

    static setLocalUsers(users) {
        localStorage.setItem('localUsers', JSON.stringify(users));
    }

    static getLocalTodos() {
        return JSON.parse(localStorage.getItem('localTodos') || '[]');
    }

    static setLocalTodos(todos) {
        localStorage.setItem('localTodos', JSON.stringify(todos));
    }

    static setCurrentUser(userId) {
        localStorage.setItem('currentUser', userId.toString());
    }

    static getCurrentUser() {
        return parseInt(localStorage.getItem('currentUser') || '1');
    }

    static setCurrentPost(postId) {
        localStorage.setItem('currentPost', postId.toString());
    }

    static getCurrentPost() {
        return parseInt(localStorage.getItem('currentPost') || '1');
    }
}