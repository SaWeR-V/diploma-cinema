const form = document.getElementById('signin_form');
const signIn = document.getElementById('signin_btn');
const login = document.getElementById('login');
const pass = document.getElementById('password');
const message = document.getElementById('auth_message');
const authFrames = document.getElementById('auth_frames');
const header = document.getElementById('header');

let halls = null;
let films = null;
let seances = null;

let logout = null;
let authKeys;

form.addEventListener('input', () => {
    authKeys = {
        login: login.value,
        password: pass.value
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

        login.value = null;
        pass.value = null; 

        message.classList.remove('hidden');
        authFrames.replaceWith(message);
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
    header.insertAdjacentHTML('beforeend', `
                <button class="sign_out fade_in" id="logout">Выйти</button>
            `);
    logout = document.getElementById('logout');
    logout.addEventListener('click', () => {
        localStorage.clear()
    });

    renderAdminTable();
};


async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const data = await response.json();
    return data.result;
};

async function identify() {
    const dataArr = await getData();
        halls = dataArr.halls;
        films = dataArr.films;
        seances = dataArr.seances;
    };



 
async function renderAdminTable() {
    await identify();

    let hallsHTML = '';

    for (let hall of halls){
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove_hall" id="${hallId}"></button></li>`;
    }

    header.insertAdjacentHTML('afterend', `
        <main class="admin_table_container fade_in">
            <section class="hall_management_container">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Управление залами</h2>
                        <button class="open_menu"></button>
                    </div>
                </div>
                <div class="content_container">
                    <ul class="halls_list">
                        <p class="available_halls">Доступные залы:</p>
                        ${hallsHTML}
                    </ul>
                </div>
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Конфигурация залов</h2>
                        <button class="open_menu"></button>
                    </div>
                </div>
            </section>
        </main>
    `)
    
}
