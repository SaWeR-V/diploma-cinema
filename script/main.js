import login from "./modules/admin/login.js";
import { sendGrid } from "./modules/admin/sendGrid.js";
import { addSeances, deleteSeances } from "./modules/admin/seancesMgmt.js";
import { editPrices } from "./modules/admin/editPrices.js";
import { getSeances } from "./modules/admin/getSeances.js";
import { dragStart, drop } from "./modules/admin/dnd.js";
import { sendNewHallCfg, deleteHall } from "./modules/admin/hallsMgmt.js";
import { addNewFilm, deleteFilm } from "./modules/admin/filmsMgmt.js";
import { salesToggle } from "./modules/admin/salesMgmt.js";
import { hallCfgInjection } from "./modules/admin/hallPlacesDrawing.js";
import { pricesConfigurator } from "./modules/admin/pricesConfugurator.js";



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

    function buildSkeleton() {

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
    };

    buildSkeleton();

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
    configHallBtns[0].classList.add('config_selected');

    Array.from(configHallBtns).some(elem => {
        if (elem.classList.contains('config_selected')) {
            hallCfgInjection();
        }
    });

    
    configHallBtns.forEach((btn) => {

            btn.addEventListener('click', () => {

            configHallBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
                hallCfgInjection();
             
            })
        })
    });



    /*---Конец блока конфигурации посадочных мест---*/

    /*   Блок конфигурации цен   */
    
    const configPricesBtns = document.querySelectorAll('.prices-cfg');
    configPricesBtns[0].classList.add('config_selected');

    Array.from(configPricesBtns).some(elem => {
        if (elem.classList.contains('config_selected')) {
            pricesConfigurator();
        }
    });

    configPricesBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            configPricesBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
                pricesConfigurator();
            }) 
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
