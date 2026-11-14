
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Login {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(CustomHttp.accessTokenKey);
        if (accessToken) {
            // location.href = '#/choice';
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
        // this.fields.forEach(item => {
        //     item.element = document.getElementById(item.id);
        //     item.element.onchange = function () {
        //         that.validateField.call(that, item, this)
        //     }
        // });

        this.processElement = document.getElementById('login-process');
        this.processElement.onclick = function (e) {
            e.preventDefault();
            that.processForm();
        }

        // if (this.page === 'signup') {
        //     this.agreeElement = document.getElementById('agree');
        //     this.agreeElement.onchange = function () {
        //         that.validateForm();
        //     }
        // }
    }

    validateField() {
        const processButton = document.getElementById('process');
        const loginForm = document.getElementById('login-form');
        let isValid = true;
        // processButton.submit = function (e) {
            if (!loginForm[0].value) {
                console.log('error');
                loginForm[0].parentNode.style.border = '1px solid red';
                isValid = false;
            }
            if (!loginForm[1].value) {
                console.log('error');
                loginForm[1].parentNode.style.border = '1px solid red';
                isValid = false;
            }
            return isValid;
        // }
    }

    // if (!element.value || !element.value.match(field.regex)) {
    //     element.parentNode.style.borderColor = 'red';
    //     field.valid = false;
    // } else {
    //     element.parentNode.removeAttribute('style');
    //     field.valid = true;
    // }
    // this.validateForm();


    // validateForm() {
    //     const validForm = this.fields.every(item => item.valid);
    //     const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
    //     if (isValid) {
    //         this.processElement.removeAttribute('disabled');
    //     } else {
    //         this.processElement.setAttribute('disabled', 'disabled');
    //     }
    //     return isValid;
    // }

    async processForm() {
        this.validateField();
        if (this.validateField()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'login') {
                try {
                    const result = await CustomHttp.request(config.host + '/login', 'POST', {
                        email: this.fields.find(item => item.email === 'email').element.value,
                        password: this.fields.find(item => item.password === 'password').element.value,
                    });
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }

                } catch (error) {
                    return console.log(error);
                }
            }

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