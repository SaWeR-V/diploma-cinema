import { renderAdminTable } from "../main.js";

const form = document.getElementById('signin_form');
const signIn = document.getElementById('signin_btn');
const login = document.getElementById('login');
const pass = document.getElementById('password');
const message = document.getElementById('auth_message');
const authFrames = document.getElementById('auth_frames');

let logout = null;
let authKeys;

form.addEventListener('input', () => {
    authKeys = {
        login: login.value,
        password: pass.value
    }
});

async function authorize() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(authKeys),
    });
    const answer = await response.json()
    
    if (answer.success === true) {
        localStorage.setItem('authData', JSON.stringify(authKeys));

        login.value = null;
        pass.value = null; 

        message.classList.remove('hidden');
        authFrames.replaceWith(message);
        document.title = 'Идём в кино: управление';
        message.innerHTML = `Добро пожаловать, <b>${authKeys.login}</b>!`;

        form.classList.add('smooth_out');
        setTimeout(() => {
            form.remove();
            header.insertAdjacentHTML('beforeend', `
                <button class="sign_out fade_in" id="logout">Выйти</button>
            `);
            renderAdminTable();
            logout = document.getElementById('logout');
            logout.addEventListener('click', () => {
                localStorage.clear()
            });
        }, 3600);
    }

    else {
        login.value = null;
        pass.value = null; 

        message.classList.remove('hidden');
        message.innerHTML = answer.error;
    }
};

signIn.addEventListener('click', (e) => {
    e.preventDefault();
    authorize();
});

if (localStorage.getItem('authData') !== null) {
    form.remove();
    document.title = 'Идём в кино: управление';

    header.insertAdjacentHTML('beforeend', `
                <button class="sign_out fade_in" id="logout">Выйти</button>
            `);
    logout = document.getElementById('logout');
    logout.addEventListener('click', () => {
        localStorage.clear()
    });

    renderAdminTable();
};


export default authorize;
