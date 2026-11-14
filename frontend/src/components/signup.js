export class Signup {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Signup.accessTokenKey);
        if (accessToken) {
            // location.href = '#/choice';
            return;
        }

        this.fields = [
            {
                name: 'name',
                id: 'name',
                // element: null,
                valid: false,
            },

            {
                name: 'lastName',
                id: 'lastName',
                // element: null,
                valid: false,
            },

            {
                name: 'email',
                id: 'email',
                // element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },

            {
                name: 'password',
                id: 'password',
                // element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                // element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        // if (this.page === 'signup') {
        //     this.fields.unshift({
        //             name: 'name',
        //             id: 'name',
        //             element: null,
        //             regex: /^[А-Я][а-я]+\s*$/,
        //             valid: false,
        //         },
        //         {
        //             name: 'lastName',
        //             id: 'lastName',
        //             element: null,
        //             regex: /^[А-Я][а-я]+\s*$/,
        //             valid: false,
        //         });
        // }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
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
        const form = document.getElementById('form');
        processButton.submit = function(e) {
            if (!form[0].value) {
                alert('Заполните имя.');
                form[0].parentNode.style.borderColor = 'red';
                return;
            }
            if (!form[1].value) {
                alert('Заполните фамилию.');
                form[1].parentNode.style.borderColor = 'red';
                return;
            }
            if (!form[2].value) {
                alert('Заполните email.');
                form[2].parentNode.style.borderColor = 'red';
                return;
            }
            if (!form[3].value) {
                alert('Заполните пароль.');
                form[3].parentNode.style.borderColor = 'red';
                return;
            }
            if (!form[4].value) {
                alert('Повторите пароль');
                form[4].parentNode.style.borderColor = 'red';
            }
        }
    }


    async processForm() {
        if (this.validateField()) {
            const name = this.fields.find(item => item.name === 'name').element.value;
            const lastName = this.fields.find(item => item.name === 'lastName').element.value;
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const result = await Signup.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value,
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

            //     try {
            //         const result = await CustomHttp.request(config.host + '/login', 'POST', {
            //             email: email,
            //             password: password,
            //         });
            //         if (result) {
            //             if (result.error || !result.accessToken || !result.refreshToken || !result.fullName
            //                 || !result.userId) {
            //                 throw new Error(result.message);
            //             }
            //
            //             Auth.setTokens(result.accessToken, result.refreshToken);
            //             Auth.setUserInfo({
            //                 fullName: result.fullName,
            //                 userId: result.userId
            //             })
            //             location.href = '#/choice';
            //         }
            //
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        }
    }
}