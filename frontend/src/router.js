import {Signup} from "./components/signup.js";
import {Login} from "./components/login.js";
import {Dohodi} from "./components/dohodi.js";
import {Rashodi} from "./components/rashodi.js";
import {categoryDohodi} from "./components/category-dohodi.js";
import {categoryRashodi} from "./components/category-rashodi.js";
import {editCategoryDohodi} from "./components/edit-category-dohodi.js";
import {editCategoryRashodi} from "./components/edit-category-rashodi.js";
import {editDohodiRashodi} from "./components/edit-dohodi-rashodi.js";
import {DohodiAndRashodi} from "./components/dohodi-and-rashodi.js";
import {CreateDohodiRashodi} from "./components/create-dohodi-rashodi.js";


export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: './templates/main.html',
                styles: '/css/main.css',
                load: () => {

                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: './templates/signup.html',
                styles: '/styles/login.css',
                load: () => {
                    new Signup('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: './templates/login.html',
                styles: '/styles/login.css',
                load: () => {
                    new Login('login');
                }
            },
            {
                route: '#/dohodi',
                title: 'Доходы',
                template: './templates/dohodi.html',
                styles: '/cs/dohodi.css',
                load: () => {
                    new Dohodi();
                }
            },
            {
                route: '#/rashodi',
                title: 'Расходы',
                template: './template/rashodi.html',
                styles: '/css/dohodi.css',
                load: () => {
                    new Rashodi();
                }
            },
            {
                route: '#/categoryDohodi',
                title: 'Категории доходов',
                template: './templates/category-dohodi.html',
                styles: '/css/category-dohodi.css',
                load: () => {
                    new categoryDohodi();
                }
            },
            {
                route: '#/categoryRashodi',
                title: 'Категории расходов',
                template: 'templates/category-rashodi.html',
                styles: '/css/category-dohodi.css',
                load: () => {
                    new categoryRashodi();
                }
            },
            {
                route: '#/editCategoryDohodi',
                title: 'Редактировать категорию доходов',
                template: './templates/edit-category-dohodi.html',
                styles: '/css/edit-category-dohodi.css',
                load: () => {
                    new editCategoryDohodi();
                }
            },
            {
                route: '#/editCategoryRashodi',
                title: 'Редактировать категорию расходов',
                template: './templates/edit-category-rashodi.html',
                styles: '/css/category-dohodi.css',
                load: () => {
                    new editCategoryRashodi();
                }
            },
            {
                route: '#/editDohodiRashodi',
                title: 'Редактировать категорию доходов/расходов',
                template: './templates/edit-dohodi-rashodi.html',
                styles: '/css/category-dohodi.css',
                load: () => {
                    new editDohodiRashodi();
                }
            },
            {
                route: '#/dohodiAndRashodi',
                title: 'Доходы и расходы',
                template: './templates/dohodi-and-rashodi.html',
                styles: '/css/dohodi-and-rashodi.css',
                load: () => {
                    new DohodiAndRashodi();
                }
            },
            {
                route: '#/createDohodiAndRashodi',
                title: 'Создание доходов и расходов',
                template: './templates/create-dohodi-rashodi.html',
                styles: '/css/category-dohodi.css',
                load: () => {
                    new CreateDohodiRashodi();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/login') {
            await Signup.logout();
            window.location.href = '#/';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        // const userInfo = Signup.getUserInfo();
        // const accessToken = localStorage.getItem(Signup.accessTokenKey);
        // if (userInfo && accessToken) {
        //     this.profileElement.style.display = 'flex';
        //     this.profileFullNameElement.innerText = userInfo.fullName;
        // } else {
        //     this.profileElement.style.display = 'none';
        // }

        newRoute.load()
    }
}