import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Signup {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Signup.accessTokenKey);
        if (accessToken) {
            return;
        }

        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                valid: false,
            },

            {
                name: 'lastName',
                id: 'lastName',
                element: null,
                valid: false,
            },

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },

            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function (e) {
            e.preventDefault();
            // that.processForm();
        }

    }

    validateField() {
        const processButton = document.getElementById('process');
        const form = document.getElementById('form');
        let isValid = true;
        let regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regExpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        let regExpRepPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

        let nameError = document.getElementById('signup-name-error')
        let lastNameError = document.getElementById('signup-lastname-error')
        let emailError = document.getElementById('signup-email-error')
        let passwordError = document.getElementById('signup-password-error')
        let repeatPasswordError = document.getElementById('signup-repeat-password-error')

        nameError.classList.remove('input-error-text');
        lastNameError.classList.remove('input-error-text');
        emailError.classList.remove('input-error-text');
        passwordError.classList.remove('input-error-text');
        repeatPasswordError.classList.remove('input-error-text');
        emailError.textContent = ''
        passwordError.textContent = ''
        form[0].parentElement.classList.remove('input-group-error');
        form[1].parentElement.classList.remove('input-group-error');
        form[2].parentElement.classList.remove('input-group-error');
        form[3].parentElement.classList.remove('input-group-error');
        form[4].parentElement.classList.remove('input-group-error');


        if (!form[0].value) {
            nameError.textContent = 'Error name is empty';
            nameError.classList.add('input-error-text');
            form[0].parentElement.classList.add('input-group-error');
            isValid = false;
        }

        if (!form[1].value) {
            lastNameError.textContent = 'Error lastName is empty';
            lastNameError.classList.add('input-error-text');
            form[1].parentElement.classList.add('input-group-error');
            isValid = false;
        }

        if (!form[2].value) {
            emailError.textContent = 'Error email is empty';
            emailError.classList.add('input-error-text');
            form[2].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (!regExpEmail.test(form[2].value.trim())) {
            emailError.textContent = 'Error invalid email';
            emailError.classList.add('input-error-text');
            form[2].parentElement.classList.add('input-group-error');
            isValid = false;
        }

        if (!form[3].value) {
            passwordError.textContent = 'Error password is empty';
            passwordError.classList.add('input-error-text');
            form[3].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (!regExpPassword.test(form[3].value.trim())) {
            passwordError.textContent = 'Error invalid password';
            passwordError.classList.add('input-error-text');
            form[3].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (form[3].value > 8) {
            passwordError.textContent = 'Password too short';
            passwordError.classList.add('input-error-text');
            form[3].parentElement.classList.add('input-group-error');
            isValid = false;
        }

        if (!form[4].value) {
            repeatPasswordError.textContent = 'Error password is empty';
            repeatPasswordError.classList.add('input-error-text');
            form[4].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (!regExpPassword.test(form[4].value.trim())) {
            repeatPasswordError.textContent = 'Error invalid password';
            repeatPasswordError.classList.add('input-error-text');
            form[4].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (form[4].value > 8) {
            repeatPasswordError.textContent = 'Password too short';
            repeatPasswordError.classList.add('input-error-text');
            form[4].parentElement.classList.add('input-group-error');
            isValid = false;
        } else if (form[4].value !== form[3].value) {
            repeatPasswordError.textContent = 'Passwords are not matched';
            repeatPasswordError.classList.add('input-error-text');
            form[4].parentElement.classList.add('input-group-error');
            isValid = false;
        }
        return isValid;
    }


    async processForm() {
        const form = document.getElementById('form');
        const name = form[0].value;
        const lastName = form[1].value;
        const email = form[2].value;
        const password = form[3].value;
        const repeat = form[4].value;

        if (this.validateField()) {
            try {
                const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                    name: name,
                    lastName: lastName,
                    email: email,
                    password: password,
                    repeat: repeat,
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