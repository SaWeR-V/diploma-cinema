import login from "./modules/admin/login.js";
import { sendGrid } from "./modules/admin/sendGrid.js";
import { addSeances, deleteSeances } from "./modules/admin/seancesMgmt.js";
import { editPrices } from "./modules/admin/editPrices.js";
import { getSeances } from "./modules/admin/getSeances.js";
import { dragStart, drop } from "./modules/admin/dnd.js";
import { sendNewHallCfg, deleteHall } from "./modules/admin/hallsMgmt.js";
import { addNewFilm, deleteFilm } from "./modules/admin/filmsMgmt.js";
import { salesToggle } from "./modules/admin/salesMgmt.js";



const main = document.querySelector('.main_container');

export async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const data = await response.json();
    const arr = data.result;

    return {
        halls: arr.halls,
        films: arr.films,
        seances: arr.seances
    }
};


export async function renderAdminTable() {
    const data = await getData();

    let halls = data.halls;
    let films = data.films;


    let hallsHTML = '';
    let hallsCfgBtns = '';
    let pricesCfgBtns = '';
    let filmsCollection = '';
    let hallTimelines = '';
    let salesCfgBtns = '';
    
    const header = document.getElementById('header');


    for (let hall of halls) {
        let hallNames = hall.hall_name;
        let hallId = hall.id;
        let hallStatus = hall.hall_open;

        hallsHTML += `<li class="halls_list_item">${hallNames}<button class="remove hall" id="${hallId}"></button></li>`;
        hallsCfgBtns += `<li class="config_btn hall-cfg" id="${hallId}">${hallNames}</li>`
        pricesCfgBtns += `<li class="config_btn prices-cfg" id="${hallId}">${hallNames}</li>`
        hallTimelines += `<div class="timeline_block"><div class="timeline" id="${hallId}"></div></div>`;
        salesCfgBtns += `<li class="config_btn sales-cfg" id="${hallId}" opened="${hallStatus}">${hallNames}</li>`
    }

    header.insertAdjacentHTML('afterend', `
        <main class="admin_table_container fade_in">
            <section class="hall_configuration">
                <div class="section_header first">
                    <div class="heading">
                        <h2 class="menu_header">Управление залами</h2>
                        <button class="menu_toggle"></button>
                    </div>
                </div>
                <div class="container">
                    <div class="content">
                        <ul class="halls_list">
                            <p class="paragraph">Доступные залы:</p>
                            ${hallsHTML}
                        </ul>
                        <button class="create_hall">Создать зал</button>
                    </div>
                </div>
                </section>
                <section class="hall_configuration">
                    <div class="section_header">
                        <div class="heading">
                            <h2 class="menu_header">Конфигурация залов</h2>
                            <button class="menu_toggle"></button>
                        </div>
                    </div>
                    <div class="container">
                        <div class="content">
                            <div class="block halls">
                                <p class="paragraph">Выберите зал для конфигурации:</p>
                                <ul class="config_list">
                                    ${hallsCfgBtns}
                                </ul>
                            </div>
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
                    <div class="container">
                        <div class="content">
                            <div class="block prices">
                                <p class="paragraph">Выберите зал для конфигурации:</p>
                                <ul class="config_list">
                                    ${pricesCfgBtns}
                                </ul>
                            </div>
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
                    <div class="container">
                        <div class="content">
                            <div class="block films">
                                <button class="add_film" id="add_film">Добавить фильм</button>
                                    <div class="films_collection"></div>
                                    <div class="timelines_mgmt">
                                        <div class="trash_bin hidden"></div>
                                        <div class="timelines_container">
                                            ${hallTimelines}
                                        </div>
                                    </div>
                            </div>
                            <div class="btns_container">
                                <button class="cancel" id="timelines_discard_changes">Отмена</button>
                                <button class="save" id="timelines_save">Сохранить</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="hall_configuration">
                    <div class="section_header last">
                        <div class="heading">
                            <h2 class="menu_header">Открыть продажи</h2>
                            <button class="menu_toggle"></button>
                        </div>
                    </div>
                    <div class="container last_container">
                        <div class="content">
                            <div class="block sales">
                                <p class="paragraph">Выберите зал для открытия/закрытия продаж:</p>
                                <ul class="config_list">
                                    ${salesCfgBtns}
                                </ul>
                            </div>
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
        const addHall = document.getElementById('add-hall');

        [closePopup, cancel].forEach(elem => {
            elem.addEventListener('click', () => {
                popupCont.remove()
            })
        });

        addHall.addEventListener('click', () => {      
            sendNewHallCfg();
        });

    });

    deleteHall();

    /*---Конец блока ПопАпа---*/

    /*   Назначение действий для кнопок (скрытие секций, удаление залов)   */


    const menuToggle = document.querySelectorAll('.menu_toggle');

    menuToggle.forEach((btn) => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section');
            if (section) {
                const currentContainer = section.querySelector('.container')
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
                            <p class="hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
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
    }
    
    const availableFilms = document.querySelector('.films_collection');
    availableFilms.innerHTML = filmsCollection;
    
    dragStart();
    
    for (let hall of halls) {
        let timeLines = document.querySelectorAll('div.timeline');
        timeLines.forEach(timeline => {
            if (+timeline.id === hall.id) {
                timeline.insertAdjacentHTML('beforebegin', `<h2 class="timeline_title">${hall.hall_name}</h2>`)
                timeline.insertAdjacentHTML('afterend', `<div class="footnotes" id="${timeline.id}"></div>`);
            }

            
            timeline.ondragover = function allowDrop(event) {
                event.preventDefault()
            };

            
            timeline.ondrop = drop;
        })  
    };

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
            addNewFilm();
            popupCont.remove()
        });


});
         
deleteFilm();

/*   конец блока поп-ап добавления фильма   */

salesToggle();

/*----конец блока конфигурации сеансов----*/


/* Блок управления продажами */



    const timelinesSave = document.getElementById('timelines_save');
    timelinesSave.onclick = addSeances;

    const timelinesDiscard = document.getElementById('timelines_discard_changes');
    timelinesDiscard.onclick = () => {
        const timelines = document.querySelectorAll('.timeline');
        timelines.forEach(timeline => {timeline.innerHTML = ''});

        const footnotes = document.querySelectorAll('.footnotes');
        footnotes.forEach(footnote => footnote.innerHTML = '');

        getSeances();
    }

};

/*---- конец блока управления продажами ----*/

    


deleteSeances();
