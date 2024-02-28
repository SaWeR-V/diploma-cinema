import { fillTimetable } from "./modules/user/timetable.js";
import { checkForSeances, checkForTimeOut } from "./modules/user/seancesCheck.js";
import { check } from "./modules/user/ticketsResponse.js";

export async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const answer = await response.json();
    const data = answer.result;

    return {
        films : data.films,
        halls : data.halls,
        seances : data.seances,
    }
};

const data = await getData();

console.log(data)

const films = data.films;
const halls = data.halls;
const seances = data.seances;

const frames = document.querySelectorAll('li.frame');
const nav = document.querySelector('nav');
const auth = document.querySelector('button.sign_in');
const header = document.querySelector('.header_container');


fillTimetable();


addCards();
checkForSeances();
checkForTimeOut();    
    


export function showHall() {

    
    const seanceBtns = document.querySelectorAll('button.seance_btn');
    const cinemaBlocks = document.querySelectorAll('section.cinema_block');

    seanceBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.setAttribute('clicked', 1)
            cinemaBlocks.forEach((block) => {
                block.classList.add('fade_out');
                    setTimeout(() => block.classList.add('hidden'), 450);
                });
        nav.classList.add('fade_out')
        auth.classList.add('fade_out')
        
        setTimeout(() => {
            nav.classList.add('hidden') 
            auth.classList.add('hidden')}, 450);
        
        const selectedFilmId = +btn.getAttribute('film_id');
        const selectedSeance = btn.textContent;
        let hallName;
        let filmName;


        for (let hall of halls) {
            if (hall.id === +btn.id){
                hallName = hall.hall_name
            }
        };

        for (let film of films) {
            if (selectedFilmId === film.id) {
                filmName = film.film_name;
    
            header.insertAdjacentHTML('afterend', `
                                <div class="hall_container fade_in">
                                    <section class="seance_description">
                                        <div class="descriptions">
                                            <h3>${filmName}</h3>
                                            <p><span class="seance_starts">Начало сеанса: ${selectedSeance}</span></p>
                                            <h3>${hallName}</h3>
                                        </div>
                                    </section>
                                        <div class="places_container">
                                            <div class="places" id="places">
                                                <div class="display">экран</div>
                                            </div>
                                            <div class="legend">
                                            </div>
                                        </div>
                                        <div class="book_container">
                                            <button class="book">Забронировать</button>
                                        </div>
                                </div>`);
                }
            };

            const seanceDesc = document.querySelector('.seance_description');
            const placesCont = document.querySelector('.places_container');

            
            let hintBlock = seanceDesc.querySelector('.seancedesc_hint');

            

            if (window.outerWidth <= 768) {
                placesCont.addEventListener('dblclick', () => {
                    placesCont.classList.toggle('scaling')
                })

                if (!hintBlock) {
                    seanceDesc.insertAdjacentHTML('beforeend', `<div class="seancedesc_hint">Тапните дважды, чтобы увеличить</div>`)
                }
                else {
                    return
                }
            }


        for (let hall of halls) {
            let legend = document.querySelector('.legend');
            if (hall.id === +btn.id) {
                legend.insertAdjacentHTML('afterbegin', `
                    <div class="cell_legend"> Свободно (${hall.hall_price_standart}руб)</div>
                    <div class="cell_legend_busy"> Занято</div>
                    <div class="cell_legend_vip"> Свободно (${hall.hall_price_vip}руб)</div>
                    <div class="cell_legend_choosen"> Выбрано</div>
                `)
            }
        }

        halls.filter(hall => { 
            if (hall.id === +btn.id) {
                const placesCont = document.getElementById('places');
                for (let i = 0; i < hall.hall_rows; i++) {
                    const rowContainer = document.createElement('div');
                    rowContainer.className = 'row';
                    rowContainer.id = (i + 1);
                    
                    for (let k = 0; k < hall.hall_places; k++) {
                        const seat = document.createElement('div');
                        seat.className = 'cell';
                        rowContainer.appendChild(seat);
                    }
            
                    placesCont.appendChild(rowContainer);
                }
            } else {
                return;
            }
            
            const cells = document.querySelectorAll('div.cell');
            cells.forEach(cell => {
                cell.addEventListener('click', () => {
                    if (cell.classList.contains('disabled')){
                        return
                    }
                    else {
                        cell.classList.toggle('cell_active')
                    }
                })
            })

            let temporaryArray = [];

            for (let hallCfg of halls){
                if (hallCfg.id === +btn.id){
                    for (let i = 0; i < hallCfg.hall_config.length; i++) {
                        temporaryArray = temporaryArray.concat(hallCfg.hall_config[i])
                    }
                }
            }

            for (let i = 1; i < cells.length; i++) {
                cells.forEach(cell => {
                    cell.id = i++;
                    cell.setAttribute('status', temporaryArray[i - 2])
                    if (cell.getAttribute('status') === 'vip') {
                        cell.classList.add('vip')
                        cell.setAttribute('price', hall.hall_price_vip)
                    }
                    else if (cell.getAttribute('status') === 'standart') {
                        cell.setAttribute('price', hall.hall_price_standart)
                    }
                    else {
                        cell.classList.add('disabled')
                        cell.removeAttribute('price', '')
                    }
                })
            };
            })


            
            const cells = Array.from(document.querySelectorAll('.cell'));
            const book = document.querySelector('.book');

            book.addEventListener('click', () => {
                if (cells.some(cell => cell.classList.contains('cell_active'))) {
                    check()
                }
                else {
                    alert('Выберите хотя бы одно место!')
                }
            });
        })
    })

};

showHall();

auth.addEventListener('click', () => {
    location.href = './login.html';
})




export function addCards() {
    let cinemaBlocks = document.querySelectorAll('.cinema_block');
    cinemaBlocks.forEach(block => block.remove())
    let htmlString = '';

    
    for (let film of films) {
        let poster = film.film_poster;
        let id = film.id;
        let name = film.film_name;
        let description = film.film_description;
        let duration = film.film_duration;
        let origin = film.film_origin;

        htmlString += `
            <section class="cinema_block" id="${id}">
                <div class="movie_info">
                    <img class="poster" src="${poster}">
                    <article class="movie_description">
                        <h3>${name}</h3>
                        <p class="description">${description}</p>
                        <p class="origins">${duration} минут ${origin}</p>
                    </article>
                </div>`;

        for (let hall of halls) {
            let hallName = hall.hall_name;
            let hallStatus = hall.hall_open;
            let filteredSeances = seances.filter(seance => seance.seance_hallid === hall.id && seance.seance_filmid === id);
            
            filteredSeances.sort((a, b) => {
                const timeA = parseInt(a.seance_time.split(":")[0]) * 60 + parseInt(a.seance_time.split(":")[1]);
                const timeB = parseInt(b.seance_time.split(":")[0]) * 60 + parseInt(b.seance_time.split(":")[1]);
                return timeA - timeB;
            });

            

            
            if (filteredSeances.length > 0) {
                let seancesHTML = '';
                if (hallStatus !== 0) {
                    for (let seance of filteredSeances) {
                        seancesHTML += `
                                <button class="seance_btn" id="${hall.id}" film_id="${film.id}" seance_id="${seance.id}">${seance.seance_time}</button>
                                `;
                    }
                

                    htmlString += `
                        <div class="halls">
                            <h3>${hallName}</h3>
                            <div class="seances_btns_container">
                                ${seancesHTML}
                            </div>
                        </div>`;
                }
            }

        }

        htmlString += `
                </div>
            </section>`;
    }
    
    nav.insertAdjacentHTML('afterend', htmlString)

    
};  