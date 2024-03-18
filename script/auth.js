import login from "./modules/login.js";
// import { createDom } from "./modules/dom_creator.js";
login();

const header = document.getElementById('header');
let halls = null;
let films = null;
let seances = null;


export async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const data = await response.json();
    return data.result;
};

export async function identify() {
    const dataArr = await getData();
        halls = dataArr.halls;
        films = dataArr.films;
        seances = dataArr.seances;
    };

export async function renderAdminTable() {
    await identify();

    let hallsHTML = '';
    let hallsCfgBtns = '';
    let pricesCfgBtns = '';
    let filmsCollection = '';
    let hallTimelines = '';
    let salesCfgBtns = '';
    let hallsOptions = '';
    let filmsOptions = '';



    const main = document.querySelector('main.main_container');


    for (let hall of halls) {
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        let hallStatus = hall.hall_open;

        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove hall" id="${hallId}"></button></li>`;
        hallsCfgBtns += `<li class="config_btn hall-cfg" id="${hallId}">${hallNames}</li>`
        pricesCfgBtns += `<li class="config_btn prices-cfg" id="${hallId}">${hallNames}</li>`
        hallTimelines += `<div class="timeline_block"><div class="timeline" id="${hallId}"></div></div>`;
        salesCfgBtns += `<li class="config_btn sales-cfg" id="${hallId}" opened="${hallStatus}">${hallNames}</li>`
        hallsOptions += `<option class="hall_option">${hallNames}</option>`;
    }

    header.insertAdjacentHTML('afterend', `
        <main class="admin_table_container fade_in">
            <section class="hall_configuration">
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
                            <div class="dragndrop_area">
                                <div class="films_collection"></div>
                                <div class="timelines_container">
                                    ${hallTimelines}
                                </div>
                            </div>
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
    /*   Блок формирования DOM   */


    /*---Конец блока формирования DOM---*/

    /*   Блок ПопАпа на добавление зала   */

    const createHall = document.querySelector('button.create_hall');
    createHall.addEventListener('click', () => {
        main.insertAdjacentHTML('afterbegin', `
            <div class="popup_container fade_in">
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

            popupCont.remove();

            for (let hall of halls) {
                let hallNames = hall.hall_name;
                let hallId = hall.id;
                hallsList.innerHTML += `<li class="halls_list_item">${hallNames}<button class="remove hall" id="${hallId}"></button></li>`;
            } 
        });

    });

    /*---Конец блока ПопАпа---*/

    /*   Назначение действий для кнопок (скрытие секций, удаление залов)   */

    const removeHallBtns = document.querySelectorAll('button.remove.hall');

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
        }
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
                let standart = hall.hall_price_standart;
                let vip = hall.hall_price_vip;
                

                if (hall.id === +btn.id) {

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

        filmsCollection += `<div class="film_card" id="${filmId}">
                                <img class="poster" src="${filmPoster}">    
                                <div class="film_info">
                                    <h4 class="film_name">${filmName}</h4>
                                    <div class="card_control">
                                        <p><span>${filmDuration}</span> минут</p>
                                        <button class="remove film" id="${filmId}"></button>
                                    </div>
                                </div>
                            </div>
                            `;

        filmsOptions += `<option class="film_option">${filmName}</option>`;
    }
    
    const avilableFilms = document.querySelector('.films_collection');
    avilableFilms.innerHTML = filmsCollection;

    const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];

    function randomizeColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex]
    };

    const filmCards = document.querySelectorAll('div.film_card');

    filmCards.forEach(card => {
        card.style.backgroundColor = randomizeColor();

        card.draggable = true;
        card.querySelector('img').draggable = false;

        card.addEventListener(`dragstart`, (event) => {
            event.dataTransfer.setData('filmName', card.querySelector('.film_name').textContent);
            event.dataTransfer.setData('filmDuration', card.querySelector('span').textContent);
            event.dataTransfer.setData('cardColor', card.style.backgroundColor);

            event.dataTransfer.setDragImage(event.target.querySelector('img'), 18, 25);
        })
    });
    
    const timeLines = document.querySelectorAll('div.timeline');

    for (let hall of halls) {
        timeLines.forEach(timeline => {
            if (+timeline.id === hall.id) {
                timeline.insertAdjacentHTML('beforebegin', `<h2 class="timeline_title">${hall.hall_name}</h2>`)
                timeline.insertAdjacentHTML('afterend', `<div class="footnotes" id="${timeline.id}"></div>`);
            }

            let currentHall;
            
            timeline.ondragover = allowDrop;

            function allowDrop(event) {
                event.preventDefault()
            };

            timeline.ondrop = drop;

            function drop(event) {
                currentHall = timeline.previousElementSibling.textContent;
                
                let filmName = event.dataTransfer.getData('filmName');
                let filmDuration = event.dataTransfer.getData('filmDuration');
                let cardColor = event.dataTransfer.getData('cardColor');

                main.insertAdjacentHTML('afterbegin', `
                    <div class="popup_container fade_in">
                        <div class="popup">
                            <div class="popup_header">Добавление сеанса<div class="close_popup"></div></div>
                                <form class="new_seance_params">
                                    <label class="annot_col">Название зала
                                        <div class="options">
                                            <select class="seance_input" name="hallName">
                                                ${hallsOptions}
                                            </select>
                                        </div>
                                    </label>
                                    <label class="annot_col">Название фильма
                                        <div class="options">
                                            <select class="seance_input" name="filmName">
                                                ${filmsOptions}
                                            </select>
                                        </div>
                                    </label>
                                    <label class="annot_col">Время начала
                                        <input class="seance_input time" value="00:00" type="time">
                                    </label>
                                </form>
                            <div class="popup_btns_container">
                                <button class="popup_btn" id="add-seance">Добавить фильм</button>
                                <button class="popup_btn popup_cancel">Отменить</button>
                            </div>
                        </div>
                    </div>`
                )

                const optionsHalls = document.querySelectorAll('.hall_option');
                optionsHalls.forEach(option => {
                    if (option.textContent === currentHall) {
                        option.selected = true
                    }
                })

                const optionFilm = document.querySelectorAll('.film_option');
                optionFilm.forEach(option => {
                    if (option.textContent === filmName) {
                        option.selected = true
                    }
                })
            
                function createTimelineTick() {
                    const tick = document.createElement('div');
                    tick.className = 'timeline_tick';
                    tick.innerHTML = `${filmName}`;

                    timeline.appendChild(tick);

                    const time = document.querySelector('.time').value;
                    let timeSet = {
                        hours : +time.split(':')[0],
                        minutes : +time.split(':')[1],
                    }

                    let totalMinutes = 60 * 24;
                    let minuteInPercent = (totalMinutes / 100);
                    let calculatedWidth = ((+filmDuration) / minuteInPercent).toFixed(2);
                    let calculatedOffset = ((timeSet.hours * 60 + timeSet.minutes) / minuteInPercent).toFixed(2);
                    

                    let ticksArr = timeline.querySelectorAll('.timeline_tick');
                    let ticksWidthSum = 0;

                    
                    ticksArr.forEach(elem => {ticksWidthSum += (+elem.style.width.split('%')[0])});


                    tick.style.width += calculatedWidth + '%';
                    tick.style.backgroundColor += cardColor;

                    const footnoteBlocks = document.querySelectorAll('.footnotes');
                    footnoteBlocks.forEach(block => {
                        if (+timeline.id === +block.id) {
                            let calculatedLeft = (calculatedOffset - ticksWidthSum);
                            tick.style.left = calculatedLeft + '%';
                            block.innerHTML += `<div class="time_footnote">${time}</div>`;
                        }

                        let timeFootnotes = block.querySelectorAll('.time_footnote');
                        let elemWidthAcc = 0;

                        timeFootnotes.forEach(elem => {                            
                            if (timeFootnotes[0] !== elem) {
                                    elemWidthAcc += +(elem.offsetWidth / (timeline.offsetWidth / 100)).toFixed(2);
                                    console.log(elemWidthAcc)
                                    elem.style.left += (calculatedOffset - elemWidthAcc) + '%';
                            }
                            else {
                                elem.style.left += calculatedOffset + '%';
                            }
                        })
                    })
                };
    

                const closePopup = document.querySelector('div.close_popup');
                const cancel = document.querySelector('button.popup_cancel');
                const popupCont = document.querySelector('div.popup_container');
                const addSeance = document.getElementById('add-seance');

                [closePopup, cancel].forEach(elem => {
                    elem.addEventListener('click', () => {
                        popupCont.remove()
                    })
                });

                addSeance.addEventListener('click', () => {
                    createTimelineTick();
                    popupCont.remove()
                })
            };
        })  
    };

    getSeances();

/*   Блок поп-ап добавления фильма   */
    const addFilm = document.getElementById('add_film');
    addFilm.addEventListener('click', () => {
        main.insertAdjacentHTML('afterbegin', `
            <div class="popup_container fade_in">
                <div class="popup">
                    <div class="popup_header">Добавление фильма<div class="close_popup"></div></div>
                    <form id="new_film_params">
                        <label class="popup_content">
                            <span class="popup_input_annot">Название фильма</span>
                            <input class="popup_input" name="filmName" type="text" placeholder="Например, «Гражданин Кейн»">
                        </label>
                        <label class="popup_content">
                            <span class="popup_input_annot">Продолжительность фильма (мин.)</span>
                            <input class="popup_input" name="filmDuration" type="number" min="0">
                        </label>
                            <label class="popup_content">
                            <span class="popup_input_annot">Описание фильма</span>
                            <textarea class="popup_input" name="filmDescription" type="text" spellcheck="false"></textarea>
                        </label>
                        <label class="popup_content">
                            <span class="popup_input_annot">Страна</span>
                            <input class="popup_input" name="filmOrigin" type="text">
                        </label>
                            <input class="hidden" name="filePoster" type="file" id="file-uploader">
                    </form>
                    <div class="popup_btns_container">
                        <button class="popup_btn" id="add-film">Добавить фильм</button>
                            <button class="popup_btn" id="upload-poster">Загрузить постер
                            </button>
                        <button class="popup_btn popup_cancel">Отменить</button>
                    </div>
                </div>
            </div>`
        )
        const closePopup = document.querySelector('div.close_popup');
        const cancel = document.querySelector('button.popup_cancel');
        const newFilmParams = document.getElementById('new_film_params')
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
        });

        addFilmBtn.addEventListener('click', () => {
            const params = new FormData(newFilmParams)
            fetch('https://shfe-diplom.neto-server.ru/film', {
                method: 'POST',
                body: params 
            })
            .then( response => response.json())
            .then( data => console.log( data ));
    
        });
        
        });

        
        
        


/*   конец блока поп-ап добавления фильма   */

/* УДАЛЕНИЕ ФИЛЬМА */

const deleteFilm = document.querySelectorAll('button.remove.film');
deleteFilm.forEach(btn => {
    btn.addEventListener('click', () => {
        fetch(`https://shfe-diplom.neto-server.ru/film/${+btn.id}`, {
            method: 'DELETE',
            })
            .then( response => response.json())
            .then( data => console.log( data ));
    });
})

/* -------------------- */

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

function getSeances() {
    const timeLines = document.querySelectorAll('.timeline');
    for (let seance of seances) {
        for (let film of films) {
            timeLines.forEach(timeline => {
                if (+timeline.id === seance.seance_hallid) {
                    if (seance.seance_filmid === film.id) {
                        timeline.innerHTML += `<div class="timeline_tick" id="${film.id}" draggable="true">${film.film_name}</div>`;
                        const filmCards = document.querySelectorAll('.film_card');
                        const timelineTicks = timeline.querySelectorAll('.timeline_tick');
                        timelineTicks.forEach(tick => {
                            filmCards.forEach(filmCard => {
                                if (filmCard.id === tick.id) {
                                    tick.style.backgroundColor = filmCard.style.backgroundColor;
                                }
                            })
                        })
                    }
                }
            })
        }
    }
};
