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
    let hallsConfig = '';

    for (let hall of halls){
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove_hall" id="${hallId}"></button></li>`;
        hallsConfig += `<li class="config_btn" id="${hallId}">${hallNames}</li>`
    }

    header.insertAdjacentHTML('afterend', `
        <main class="admin_table_container fade_in">
            <section class="hall_management_container">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Управление залами</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="content_container">
                    <ul class="halls_list">
                        <p class="paragraph">Доступные залы:</p>
                        ${hallsHTML}
                    </ul>
                </div>
            </section>
            <section class="hall_configuration">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Конфигурация залов</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="content_container">
                    <div class="halls">
                        <p class="paragraph">Выберите зал для конфигурации:</p>
                        <ul class="config_list">
                            ${hallsConfig}
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    `)


    const menuToggle = document.querySelectorAll('.menu_toggle');
    const configBtns = document.querySelectorAll('.config_btn');

    menuToggle.forEach((btn) => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section');
            if (section) {
                const currentContainer = section.querySelector('.content_container')
                if (currentContainer) {
                    currentContainer.classList.toggle('hidden')
                }
            }
        })
    });

    let hallPlaces = '';
    
    configBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            configBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
            })

            let frame = document.querySelector('.halls');

            for (let hall of halls) {
                if (hall.id === +btn.id) {
                    
                    row = hall.hall_rows;
                    seat = hall.hall_places;

                    hallPlaces += `<label>Рядов, шт
                                        <form><input class="input" name="row" type="text" value="${row}">
                                    </label>
                                    <label>Мест, шт
                                        <input class="input" name="seat" type="text" value="${seat}"></form>
                                    </label>
                                    `;
                
                    if (!frame.querySelector('div.places_quantity')) {
                        frame.insertAdjacentHTML('beforeend', `
                            <div class="places_quantity">
                                <p class="paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                                <div class="places_inputs">${hallPlaces}</div>
                            </div>
                        `)
                    }
                }
            }

        })
    });

};
