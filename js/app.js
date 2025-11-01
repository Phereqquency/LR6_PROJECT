class SPA {
    constructor() {
        this.root = document.getElementById('root');
        this.router = new Router();
        this.init();
    }

    init() {
        this.renderLayout();
        this.router.init();
        this.router.loadView();
    }

    renderLayout() {
        this.root.innerHTML = `
            <div class="header">
                <div class="nav">
                    <div class="logo">SPA App</div>
                    <div class="nav-links">
                        <a href="#users" class="nav-link">Пользователи</a>
                        <a href="#users#todos" class="nav-link">Todo</a>
                        <a href="#users#posts" class="nav-link">Посты</a>
                        <a href="#users#posts#comments" class="nav-link">Комментарии</a>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="breadcrumbs" id="breadcrumbs"></div>
                <div class="search-container">
                    <input type="text" class="search-input" id="searchInput" placeholder="Поиск...">
                </div>
                <div class="content" id="content"></div>
            </div>
        `;
    }
}

// Инициализация приложения
const app = new SPA();