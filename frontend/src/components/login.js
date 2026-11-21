import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Login {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(CustomHttp.accessTokenKey);
        if (accessToken) {
            return;
        }

        this.fields = [
            {
                name: 'login-email',
                id: 'login-email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },

            {
                name: 'login-password',
                id: 'login-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        const that = this;


        this.processElement = document.getElementById('login-process');
        this.processElement.onclick = function (e) {
            e.preventDefault();
            // that.processForm();
        }

    }

    validateField() {
        const processButton = document.getElementById('process');
        const loginForm = document.getElementById('login-form');
        let isValid = true;
        let regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regExpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        let emailError = document.getElementById('login-email-error')
        let passwordError = document.getElementById('login-password-error')

        emailError.classList.remove('input-error-text');
        passwordError.classList.remove('input-error-text');
        emailError.textContent = ''
        passwordError.textContent = ''
        loginForm[0].parentElement.classList.remove('input-group-error');
        loginForm[1].parentElement.classList.remove('input-group-error');

        if (!loginForm[0].value.trim()) {
            emailError.textContent = 'Error email is empty';
            emailError.classList.add('input-error-text');
            loginForm[0].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (!regExpEmail.test(loginForm[0].value.trim())) {
            emailError.textContent = 'Error invalid email';
            emailError.classList.add('input-error-text');
            loginForm[0].parentElement.classList.add('input-group-error');
            isValid = false;
        }

        if (!loginForm[1].value) {
            passwordError.textContent = 'Error password is empty';
            passwordError.classList.add('input-error-text');
            loginForm[1].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (!regExpPassword.test(loginForm[1].value)) {
            passwordError.textContent = 'Error invalid password';
            passwordError.classList.add('input-error-text');
            loginForm[1].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (loginForm[1].value > 8) {
            passwordError.textContent = 'Password too short';
            passwordError.classList.add('input-error-text');
            loginForm[1].parentElement.classList.add('input-group-error');
            isValid = false;
        }
        return isValid;
    }


    async processForm() {
        const loginForm = document.getElementById('login-form');
        const email = loginForm[0].value;
        const password = loginForm[1].value;


        if (this.validateField()) {
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                });
                if (result) {
                    if (result.error || !result.accessToken || !result.refreshToken || !result.fullName
                        || !result.userId) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.accessToken, result.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.fullName,
                        userId: result.userId
                    })
                    location.href = '#/choice';
                }

            } catch (error) {
                console.log(error);
            }
        }


    }

}