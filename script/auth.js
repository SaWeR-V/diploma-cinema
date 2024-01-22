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

    /*   Блок формирования DOM   */


    let hallsHTML = '';
    let hallsCfgBtns = '';
    let pricesCfgBtns = '';
    let filmsCollection = '';
    let hallTimelines = '';
    let salesCfgBtns = '';


    for (let hall of halls){
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        let hallStatus = hall.hall_open;

        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove_hall" id="${hallId}"></button></li>`;
        hallsCfgBtns += `<li class="config_btn hall-cfg" id="${hallId}">${hallNames}</li>`
        pricesCfgBtns += `<li class="config_btn prices-cfg" id="${hallId}">${hallNames}</li>`
        hallTimelines += `<div class="timeline" id="${hallId}"></div>`;
        salesCfgBtns += `<li class="config_btn sales-cfg" id="${hallId}" opened="${hallStatus}">${hallNames}</li>`
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
                    <ul class="halls_list" id="hallsList">
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
                        <button class="add_film" id="add_film">Добавить фильм</button>
                        <div class="films_collection"></div>
                        ${hallTimelines}
                    </div>
                </div>
            </section>
            <section class="hall_configuration">
                <div class="section_header">
                    <div class="heading">
                        <h2 class="menu_header">Открыть продажи</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="content_container">
                    <div class="block sales">
                        <p class="paragraph">Выберите зал для открытия/закрытия продаж:</p>
                        <ul class="config_list">
                            ${salesCfgBtns}
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    `);

    /*---Конец блока формирования DOM---*/

    /*   Блок ПопАпа на добавление зала   */

    const createHall = document.querySelector('button.create_hall');
    createHall.addEventListener('click', () => {
        const main = document.querySelector('main.main_container');
        main.insertAdjacentHTML('afterbegin', `
            <div class="popup_container">
                <div class="popup">
                    <div class="popup_header">Добавление зала<div class="close_popup"></div></div>
                    <label class="popup_content">
                        <span class="popup_input_annot">Название зала</span>
                        <input class="popup_input" type="text" id="new_hall_popup_input" placeholder="Например, «Зал 1»">
                    </label>
                    <div class="popup_btns_container">
                        <button class="popup_btn" id="add-hall">Добавить зал</button>
                        <button class="popup_btn popup_cancel">Отменить</button>
                    </div>
                </div>
            </div>
        `)

        const closePopup = document.querySelector('div.close_popup');
        const cancel = document.querySelector('button.popup_cancel');
        const newHallName = document.getElementById('new_hall_popup_input');
        const addHall = document.getElementById('add-hall');
        const popupCont = document.querySelector('div.popup_container');

        [closePopup, cancel].forEach(elem => {
            elem.addEventListener('click', () => {
                popupCont.remove()
            })
        });

        addHall.addEventListener('click', () => {
            const params = new FormData()
            params.set('hallName', `${newHallName.value}`)
            fetch('https://shfe-diplom.neto-server.ru/hall', {
                method: 'POST',
                body: params 
            })
            .then( response => response.json())
            .then( data => console.log( data ));

            const hallsList = document.getElementById('hallsList');
            hallsList.innerHTML = '';
        
            for (let hall of halls) {
                let hallNames = hall.hall_name;
                let hallId = hall.id;
                hallsList.innerHTML += `<li class="halls_list_item">${hallNames}<button class="remove_hall" id="${hallId}"></button></li>`;
            }

            console.log(hallsList)
            popupCont.remove()
        });

    });

    /*---Конец блока ПопАпа---*/

    /*   Назначение действий для кнопок (скрытие секций, удаление залов)   */

    const removeHallBtns = document.querySelectorAll('button.remove_hall');

    removeHallBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            fetch(`https://shfe-diplom.neto-server.ru/hall/${+btn.id}`, {
            method: 'DELETE',
            })
            .then( response => response.json())
            .then( data => console.log( data ));
        })
    });
 

    const menuToggle = document.querySelectorAll('.menu_toggle');

    menuToggle.forEach((btn) => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section');
            if (section) {
                const currentContainer = section.querySelector('.content_container')
                if (currentContainer) {
                    currentContainer.classList.toggle('hidden')
                    btn.classList.toggle('closed')
                }
            }
        })
    });

    /*---------------*/

    /*   Блок конфигурации посадочных мест   */

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
            
                if (hall.id === +btn.id) {
                    for (let i = 0; i < hall.hall_config.length; i++) {
                        hallCfg.push(...hall.hall_config[i]);
                    }
                }   
                
            };

            hallPlaces += `<label class="annot_col">Рядов, шт
                                    <input class="input" id="row" type="number" value="${row}" min="0">
                                </label>
                                <span class="multiplier">x</span>
                                <label class="annot_col">Мест, шт
                                    <input class="input" id="seat" type="number" value="${seat}" min="0">
                                </label>
                                `;

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
                                <button class="cancel" id="hall_discard_changes">Отмена</button>
                                <button class="save" id="places_grid">Сохранить</button>
                            </div>
                        </div>
                        `)
                };
                        
            const rowArea = document.getElementById('row');
            const seatArea = document.getElementById('seat');

            const mapContainer = document.getElementById('map_container');
            
            mapContainer.innerHTML = `<div class="places_container" id="places_container"></div>`;

            function drawHallGrid() {

            if (rowArea && seatArea) {
                rowArea.value = row;
                seatArea.value = seat;
                
                const placesContainer = document.getElementById('places_container');

                placesContainer.innerHTML = '';

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
                
                    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                        const cell = cells[cellIndex];
                        const initStatus = hallCfg[cellIndex]; 
                        cell.setAttribute('status', initStatus);
                
                        const statuses = ['standart', 'vip', 'disabled'];
                
                        cell.addEventListener('click', () => {
                            const newStatus = statuses[currentStatusIndex];
                            cell.setAttribute('status', newStatus); 
                            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
                
                            cell.classList.remove(...statuses);
                            cell.classList.add(newStatus);
                        });
                
                        if (initStatus === 'standart') {
                            cell.classList.add('standart');
                        } else if (initStatus === 'vip') {
                            cell.classList.add('vip');
                        } else {
                            cell.classList.add('disabled');
                        }
                    }
                }
            }
            };
        
            drawHallGrid();
            
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
            
                    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                        const cell = cells[cellIndex];
                        const initStatus = hallCfg[cellIndex]; 
                        cell.setAttribute('status', initStatus);
                
                        const statuses = ['standart', 'vip', 'disabled'];
                
                        cell.addEventListener('click', () => {
                            const newStatus = statuses[currentStatusIndex];
                            cell.setAttribute('status', newStatus); 
                            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
                
                            cell.classList.remove(...statuses);
                            cell.classList.add(newStatus);
                        });
                
                        if (initStatus === 'standart') {
                            cell.classList.add('standart');
                        } else if (initStatus === 'vip') {
                            cell.classList.add('vip');
                        } else {
                            cell.classList.add('disabled');
                        }
                    }
                };

            sendGrid();

            const discardChangesHall = document.getElementById('hall_discard_changes');
            discardChangesHall.addEventListener('click', () => {
                drawHallGrid();
            })
        })
    });



    /*---Конец блока конфигурации посадочных мест---*/

    /*   Блок конфигурации цен   */
    
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
                                        <button class="cancel" id="discard_changes_prices">Отмена</button>
                                        <button class="save" id="save_prices">Сохранить</button>
                                    </div>
                                    `;

                }
            }

            let standartPrice = document.getElementById('standart-price');
            let vipPrice = document.getElementById('vip-price');


            const discardChangesPrices = document.getElementById('discard_changes_prices');
            discardChangesPrices.addEventListener('click', () => {
                    standartPrice.value = standart;
                    vipPrice.value = vip;
            })

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

        editPrices();

        })
    });

    /*----конец блока конфигурации цен----*/

    /*   Блок конфигурации сеансов   */

    for (let film of films) {
        let filmName = film.film_name;
        let filmId = film.id;
        let filmPoster = film.film_poster;
        let filmDuration = film.film_duration;

        filmsCollection += `<div class="film_card" id="${filmId}" draggable="true"">
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
    });
    
    const timeLines = document.querySelectorAll('div.timeline');

    for (let hall of halls) {
        hallName = hall.hall_name;
        timeLines.forEach(timeline => {
            if(+timeline.id === hall.id) {
                timeline.insertAdjacentHTML('beforebegin', `<h2 class="timeline_title">${hallName}</h2>`)
            }
        })  
    };

/*   Блок поп-ап добавления фильма   */
    const addFilm = document.getElementById('add_film');
    addFilm.addEventListener('click', () => {
        const main = document.querySelector('main.main_container');
        main.insertAdjacentHTML('afterbegin', `
            <div class="popup_container">
                <div class="popup">
                    <div class="popup_header">Добавление фильма<div class="close_popup"></div></div>
                    <label class="popup_content">
                        <span class="popup_input_annot">Название фильма</span>
                        <input class="popup_input" type="text" id="new_film_title" placeholder="Например, «Гражданин Кейн»">

                        <span class="popup_input_annot">Продолжительность фильма (мин.)</span>
                        <input class="popup_input" type="number" id="new_film_duration" min="0">

                        <span class="popup_input_annot">Описание фильма</span>
                        <textarea class="popup_input" type="text" id="new_film_description" spellcheck="false"></textarea>

                        <span class="popup_input_annot">Страна</span>
                        <input class="popup_input" type="text" id="new_film_origin">
                    </label>
                    <div class="popup_btns_container">
                        <button class="popup_btn" id="add-film">Добавить фильм</button>
                        <button class="popup_btn" id="upload-poster">Загрузить постер
                            <input class="hidden" type="file" id="file-uploader">
                        </button>
                        <button class="popup_btn popup_cancel">Отменить</button>
                    </div>
                </div>
            </div>`
        )
        const closePopup = document.querySelector('div.close_popup');
        const cancel = document.querySelector('button.popup_cancel');
        const newFilmTitle = document.getElementById('new_film_title');
        const newFilmDuration = document.getElementById('new_film_duration');
        const newFilmDescription = document.getElementById('new_film_description');
        const newFilmOrigin = document.getElementById('new_film_origin');
        const addFilmBtn = document.getElementById('add-film');
        const uploadPoster = document.getElementById('upload-poster');
        const fileUploader = document.getElementById('file-uploader');

        const popupCont = document.querySelector('div.popup_container');

        [closePopup, cancel].forEach(elem => {
            elem.addEventListener('click', () => {
                popupCont.remove()
            })
        });


        uploadPoster.addEventListener('click', () => {
            fileUploader.click()
        })

        addFilmBtn.addEventListener('click', () => {
            const params = new FormData()
            params.set('filmName', `${newFilmTitle.value}`)
            params.set('filmDuration', `${+newFilmDuration.value}`)
            params.set('filmDescription', `${newFilmDescription.value}`)
            params.set('filmOrigin', `${newFilmOrigin.value}`)
            params.set('filePoster', `${fileUploader.files[0]}`)


            // console.log(fileUploader.files[0])
            fetch('https://shfe-diplom.neto-server.ru/film', {
                method: 'POST',
                body: params 
            })
            .then( response => response.json())
            .then( data => console.log( data ));
    
        })
        
        });

        
        
        


/*   конец блока поп-ап добавления фильма   */

/*----конец блока конфигурации сеансов----*/


/* Блок управления продажами */

    const configSalesBtns = document.querySelectorAll('.sales-cfg');
    const blockSales = document.querySelector('div.sales');
    let statusMsg = document.querySelector('div.sales_message');

    configSalesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            configSalesBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
            });

            if (Array.from(configSalesBtns).some(btn => btn.classList.contains('config_selected'))) {
                if (!statusMsg) {
                    blockSales.insertAdjacentHTML('beforeend', `<div class="sales_message"></div>`);
                    statusMsg = document.querySelector('div.sales_message');
                }
                if (btn.getAttribute('opened') === '1') {
                    statusMsg.innerHTML = `<p class="paragraph">Продажи билетов открыты!</p>
                                            <button class="sales_manager" id="sales_manager">Приостановить продажу билетов</button>`
                }
                else {
                    statusMsg.innerHTML = `<p class="paragraph">Продажи билетов закрыты.</p>
                                            <button class="sales_manager" id="sales_manager">Открыть продажу билетов</button>`
                }
            }
            const salesManager = document.getElementById('sales_manager');
            salesManager.addEventListener('click', () => {
                if (btn.getAttribute('opened') === '0') {
                    const params = new FormData()
                    params.set('hallOpen', '1')
                    fetch(`https://shfe-diplom.neto-server.ru/open/${+btn.id}`, {
                            method: 'POST',
                            body: params 
                        })
                        .then(response => response.json())
                        .then(data => console.log(data));
                }
                else {
                    const params = new FormData()
                    params.set('hallOpen', '0')
                    fetch(`https://shfe-diplom.neto-server.ru/open/${+btn.id}`, {
                            method: 'POST',
                            body: params 
                        })
                        .then(response => response.json())
                        .then(data => console.log(data));
                }
            });
        })
    })
};

/*---- конец блока управления продажами ----*/

function sendGrid() {

    const arrayConfig = [];
    let hallGridBlock = document.querySelector('div.hall_map');

        if (hallGridBlock) {
            const savePlacesGrid = document.getElementById('places_grid');

            savePlacesGrid.addEventListener('click', () => {
                const iterableRows = document.querySelectorAll('div.hall_row');
                iterableRows.forEach(row => {
                    const cells = row.querySelectorAll('div.cell');
                    const rowArr = [];

                    cells.forEach(cell => {
                        rowArr.push(cell.getAttribute('status'));
                    });
        
                    arrayConfig.push(rowArr)
                });

                const rowArea = document.getElementById('row');
                const seatArea = document.getElementById('seat');
                const currentHall = document.querySelector('.hall-cfg.config_selected');
            
                const params = new FormData()
                    params.set('rowCount', `${rowArea.value}`)
                    params.set('placeCount', `${seatArea.value}`)
                    params.set('config', JSON.stringify(arrayConfig))
                    fetch(`https://shfe-diplom.neto-server.ru/hall/${+currentHall.id}`, {
                        method: 'POST',
                        body: params 
                    })
                        .then( response => response.json())
                        .then( data => console.log( data ));
            
                })  
        };
};

function editPrices() {
    const savePrices = document.getElementById('save_prices');
    const currentHall = document.querySelector('.prices-cfg.config_selected');
    const stdPrice = document.getElementById('standart-price');
    const vipPrice = document.getElementById('vip-price');

    savePrices.addEventListener('click', () => {
        const params = new FormData()
            params.set('priceStandart', `${+stdPrice.value}`)
            params.set('priceVip', `${+vipPrice.value}`)
            fetch(`https://shfe-diplom.neto-server.ru/price/${+currentHall.id}`, {
                method: 'POST',
                body: params 
            })
                .then( response => response.json())
                .then( data => console.log( data ));
    })
};
