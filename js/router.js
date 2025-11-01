class Router {
    constructor() {
        this.currentView = '';
        this.searchTerm = '';
    }

    init() {
        this.setupRouting();
        this.setupSearch();
    }

    setupRouting() {
        window.addEventListener('hashchange', () => {
            this.loadView();
        });
    }

    setupSearch() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchInput') {
                this.searchTerm = e.target.value;
                this.loadView();
            }
        });
    }

    loadView() {
        const hash = window.location.hash.slice(1);
        this.currentView = hash;
        this.renderBreadcrumbs();
        this.renderContent();
    }

    renderBreadcrumbs() {
        const breadcrumbs = document.getElementById('breadcrumbs');
        const parts = this.currentView.split('#').filter(part => part);
        
        let breadcrumbHTML = '';
        let path = '';
        
        parts.forEach((part, index) => {
            path += (index > 0 ? '#' : '') + part;
            const isLast = index === parts.length - 1;
            
            breadcrumbHTML += `
                <span class="breadcrumb-item">
                    ${isLast ? 
                        `<span>${this.getBreadcrumbName(part)}</span>` : 
                        `<a href="#${path}" class="breadcrumb-link">${this.getBreadcrumbName(part)}</a>`
                    }
                </span>
            `;
        });

        breadcrumbs.innerHTML = breadcrumbHTML || '<span class="breadcrumb-item">Главная</span>';
    }

    getBreadcrumbName(part) {
        const names = {
            'users': 'Пользователи',
            'todos': 'Todo',
            'posts': 'Посты',
            'comments': 'Комментарии'
        };
        return names[part] || part;
    }

    renderContent() {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading">Загрузка...</div>';

        setTimeout(() => {
            switch(this.currentView) {
                case 'users':
                    if (window.userManager) window.userManager.renderUsers();
                    break;
                case 'users#todos':
                    if (window.todoManager) window.todoManager.renderTodos();
                    break;
                case 'users#posts':
                    if (window.postManager) window.postManager.renderPosts();
                    break;
                case 'users#posts#comments':
                    if (window.commentManager) window.commentManager.renderComments();
                    break;
                default:
                    if (window.userManager) window.userManager.renderUsers();
            }
        }, 300);
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}