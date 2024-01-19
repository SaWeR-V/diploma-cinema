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
    let hallsCfgBtns = '';
    let pricesCfgBtns = '';
    let filmsCollection = '';
    let hallTimeline = '';

    for (let hall of halls){
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove_hall" id="${hallId}"></button></li>`;
        hallsCfgBtns += `<li class="config_btn hall-cfg" id="${hallId}">${hallNames}</li>`
        pricesCfgBtns += `<li class="config_btn prices-cfg" id="${hallId}">${hallNames}</li>`
        hallTimeline += `<div class="timeline" id="timeline" ondrop="drop(event)" ondragover="allowDrop(event)">`
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
                    <button class="create_hall">Создать зал</button>
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
                    <div class="block halls">
                        <p class="paragraph">Выберите зал для конфигурации:</p>
                        <ul class="config_list">
                            ${hallsCfgBtns}
                        </ul>
                    </div>
                </div>
            </section>
            <section class="hall_configuration">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Конфигурация цен</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="content_container">
                    <div class="block prices">
                        <p class="paragraph">Выберите зал для конфигурации:</p>
                        <ul class="config_list">
                            ${pricesCfgBtns}
                        </ul>
                    </div>
                </div>
            </section>
            <section class="hall_configuration">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Сетка сеансов</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="content_container">
                    <div class="block films">
                        <button class="add_film">Добавить фильм</button>
                        <div class="films_collection"></div>
                        ${hallTimeline}
                    </div>
                </div>
            </section>
        </main>
    `)


    const menuToggle = document.querySelectorAll('.menu_toggle');

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

    const configHallBtns = document.querySelectorAll('.hall-cfg');

    configHallBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            configHallBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
            })

            let frame = document.querySelector('.halls');
            let hallPlaces = '';
            let row;
            let seat;
            let hallCfg = [];


            for (let hall of halls) {

                if (hall.id === +btn.id) {
                    row = hall.hall_rows;
                    seat = hall.hall_places;
                }

                hallPlaces += `<label class="annot_col">Рядов, шт
                                    <input class="input" id="row" type="number" value="${row}" min="0">
                                </label>
                                <span class="multiplier">x</span>
                                <label class="annot_col">Мест, шт
                                    <input class="input" id="seat" type="number" value="${seat}" min="0">
                                </label>
                                `;
            
                let rowArea = document.getElementById('row');
                let seatArea = document.getElementById('seat');
                   
                if (frame) {
                    if (!frame.querySelector('div.places_quantity')) {
                        frame.insertAdjacentHTML('beforeend', `
                            <div class="places_quantity">
                                <p class="paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                                <div class="places_inputs">${hallPlaces}</div>
                            </div>
                            <div class="hall_map">
                                <p class="paragraph">Теперь Вы можете указать типы кресел на схеме зала:</p>
                                <div class="hall_map_legend">
                                    <span class="cell"></span>
                                        <p class="legend_annotation"> — обычные кресла</p>
                                    <span class="cell vip"></span>
                                        <p class="legend_annotation"> — VIP кресла </p>
                                    <span class="cell disabled"></span>
                                        <p class="legend_annotation"> — заблокированные (нет кресла)</p>
                                </div>
                                <p class="legend_annotation">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                                <div class="map_container" id="map_container"></div>
                                <div class="btns_container">
                                    <button class="cancel">Отмена</button>
                                    <button class="save">Сохранить</button>
                                </div>
                            </div>
                            `)
                    }
                               
                const mapContainer = document.getElementById('map_container');

                mapContainer.innerHTML = `<div class="places_container" id="places_container"></div>`;

                if (rowArea && seatArea) {
                    rowArea.value = row;
                    seatArea.value = seat;
                    
                    const placesContainer = document.getElementById('places_container');

                    for (let i = 0; i < rowArea.value; i++) {
                            const rowContainer = document.createElement('div');
                            rowContainer.className = 'hall_row';
                                
                        for (let k = 0; k < seatArea.value; k++) {
                            const seat = document.createElement('div');
                            seat.className = 'cell';
                            rowContainer.appendChild(seat);
                            }

                        placesContainer.appendChild(rowContainer);
                    }
                    if (placesContainer) {
                        const cells = document.querySelectorAll('div.cell');
                        let currentStatusIndex = 0;

                        for (let i = 0; i < cells.length; i++) {

                            cells[i].setAttribute('status', hallCfg[i]);
                            const statuses = ['standart', 'vip', 'disabled'];

                            cells[i].addEventListener('click', () => {
                                cells[i].setAttribute('status', statuses[currentStatusIndex])
                                currentStatusIndex = (currentStatusIndex + 1) % statuses.length;

                                cells[i].classList.remove(...statuses);
                                cells[i].classList.add(statuses[currentStatusIndex]);
                            }) 

                            if (cells[i].getAttribute('status') === 'vip') {
                                cells[i].classList.add('vip')
                            }
                            else if (cells[i].getAttribute('status') === 'standart') {
                                cells[i].classList.add('standart')
                            }
                            else {
                                cells[i].classList.add('disabled')
                            }
                        }

                        
                    }
                }
                    
                if (rowArea) {
                    rowArea.addEventListener('input', (event) => {
                        const newRowValue = event.target.value;
                        row = newRowValue;
                        updatePlacesContainer(row, seat);
                    });
                }

                if (seatArea) {
                    seatArea.addEventListener('input', (event) => {
                        const newSeatValue = event.target.value;
                        seat = newSeatValue;
                        updatePlacesContainer(row, seat);
                    });
                }

                function updatePlacesContainer(newRow, newSeat) {
                    const placesContainer = document.getElementById('places_container');
                    placesContainer.innerHTML = '';
                    
                    for (let i = 0; i < newRow; i++) {
                        const rowContainer = document.createElement('div');
                        rowContainer.className = 'hall_row';
                    
                        for (let k = 0; k < newSeat; k++) {
                            const seat = document.createElement('div');
                            seat.className = 'cell';
                            rowContainer.appendChild(seat);
                        }
                    
                        placesContainer.appendChild(rowContainer);
                        }

                        const cells = document.querySelectorAll('div.cell');
                        let currentStatusIndex = 0;

                        for (let i = 0; i < cells.length; i++) {

                            cells[i].setAttribute('status', hallCfg[i]);
                            const statuses = ['standart', 'vip', 'disabled'];

                            cells[i].addEventListener('click', () => {
                                cells[i].setAttribute('status', statuses[currentStatusIndex])
                                currentStatusIndex = (currentStatusIndex + 1) % statuses.length;

                                cells[i].classList.remove(...statuses);
                                cells[i].classList.add(statuses[currentStatusIndex]);
                            }) 

                            if (cells[i].getAttribute('status') === 'vip') {
                                cells[i].classList.add('vip')
                            }
                            else if (cells[i].getAttribute('status') === 'standart') {
                                cells[i].classList.add('standart')
                            }
                            else {
                                cells[i].classList.add('disabled')
                            }
                        }
                    }
                }

                if (hall.id === +btn.id) {
                    for (let i = 0; i < hall.hall_config.length; i++) {
                        hallCfg = hallCfg.concat(hall.hall_config[i])
                    }
                }
            }
        })
    });

    const configPricesBtns = document.querySelectorAll('.prices-cfg');

    configPricesBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            configPricesBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
            })

            let frame = document.querySelector('.prices');
            let inputsContainer = document.getElementById('price_inputs')

            if (!inputsContainer) {
                inputsContainer = document.createElement('div');
                inputsContainer.className = 'price_inputs';
                inputsContainer.id = 'price_inputs';
                frame.appendChild(inputsContainer);
            } else {
                inputsContainer.innerHTML = '';
            }

            for (let hall of halls) {
                
                if (hall.id === +btn.id) {
                    standart = hall.hall_price_standart;
                    vip = hall.hall_price_vip;


                    inputsContainer.innerHTML = `<p class="paragraph">Установите цены для типов кресел:</p>
                                    <div class="price_cont">
                                        <label class="annot_col">Цена, рублей
                                            <div class="price_annotation"><input class="input price" id="standart-price" type="number" value="${standart}" min="0">
                                            <div class="price_legend_block">за <span class="cell price_legend"></span>обычные кресла</div>
                                        </label>                                       
                                    </div>
                                    <div class="price_cont">
                                        <label class="annot_col">Цена, рублей
                                            <div class="price_annotation"><input class="input price price-vip" id="vip-price" type="number" value="${vip}" min="0">
                                            <div class="price_legend_block">за <span class="cell vip price_legend"></span>VIP кресла</div>
                                        </label> 
                                    </div>
                                    <div class="btns_container">
                                        <button class="cancel">Отмена</button>
                                        <button class="save">Сохранить</button>
                                    </div>
                                    `;

                }
            }

            let standartPrice = document.getElementById('standart-price');
            let vipPrice = document.getElementById('vip-price');


            standartPrice.addEventListener('input', (event) => {
                if (event.target.value <= 0) {
                    event.target.style.color = 'rgb(117, 117, 117)';
                }
                else {
                    event.target.style.color = 'rgb(0, 0, 0)'
                }
            })
            vipPrice.addEventListener('input', (event) => {
                if (event.target.value <= 0) {
                    event.target.style.color = 'rgb(117, 117, 117)';
                }
                else {
                    event.target.style.color = 'rgb(0, 0, 0)'
                }
            })
        })
    });

    for (let film of films) {
        let filmName = film.film_name;
        let filmId = film.id;
        let filmPoster = film.film_poster;
        let filmDuration = film.film_duration;

        filmsCollection += `<div class="film_card" id="${filmId}" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)">
                                <img class="poster" src="${filmPoster}">    
                                <div class="film_info">
                                    <h4 class="film_name">${filmName}</h4>
                                    <div class="card_control">
                                        <p>${filmDuration} минут</p>
                                        <button class="remove_hall" id="${filmId}"></button>
                                    </div>
                                </div>
                            </div>
                            `;
    }
    
    const avilableFilms = document.querySelector('.films_collection');
    avilableFilms.innerHTML = filmsCollection;

    const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];

    function randomizeColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex]
    }

    const filmCards = document.querySelectorAll('div.film_card');

    filmCards.forEach(card => {
        card.style.backgroundColor = randomizeColor()
    })
    
};

