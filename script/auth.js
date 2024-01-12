const form = document.getElementById('signin_form');
const signIn = document.getElementById('signin_btn');
const login = document.getElementsByName('login');
const pass = document.getElementsByName('password');
const message = document.getElementById('auth_message');
const authFrames = document.getElementById('auth_frames');

let authKeys;

form.addEventListener('change', () => {
    authKeys = {
        login: login[0].value,
        password: pass[0].value
    }
});

async function authorize(){
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

        login[0].value = null;
        pass[0].value = null; 

        message.classList.remove('hidden');
        authFrames.replaceWith(message);
        message.innerHTML = `Добро пожаловать, <b>${authKeys.login}</b>!`;

        form.classList.add('smooth_transition');
    }
    else {
        login[0].value = null;
        pass[0].value = null; 

        message.classList.remove('hidden');
        message.innerHTML = answer.error;
    }
};

signIn.addEventListener('click', (e) => {
    e.preventDefault();
    authorize();
});