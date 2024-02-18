import { getData } from "../main.js";
import { setOffsets } from "./setOffsets.js";

const data = await getData();

let halls = data.halls;
let films = data.films;

const main = document.querySelector('.main_container');

let hallsOptions = '';
let filmsOptions = '';


let draggedFilmId;
let draggedFilmDuration;
let draggedCardColor;

export function dragStart() {
    
    const filmCards = document.querySelectorAll('.film_card');
    filmCards.forEach(card => {
        card.style.backgroundColor = randomizeColor();

        card.draggable = true;
        card.querySelector('img').draggable = false;

        card.addEventListener(`dragstart`, (event) => {
            event.dataTransfer.setData('filmName', card.querySelector('.film_name').textContent);
            draggedFilmId = +event.target.id;
            draggedFilmDuration = card.querySelector('span').textContent;
            draggedCardColor = card.style.backgroundColor;

            event.dataTransfer.setDragImage(event.target.querySelector('img'), 18, 25);
        })
    })
};


export function drop(event) {
    let currentHall = event.target.previousElementSibling.textContent;;
    let filmName = event.dataTransfer.getData('filmName');

    for(let hall of halls) {
        let hallId = hall.id;
        let hallNames = hall.hall_name;

        hallsOptions += `<option class="hall_option" id="${hallId}">${hallNames}</option>`;
    }

    for (let film of films) {
        let filmName = film.film_name
        filmsOptions += `<option class="film_option">${filmName}</option>`;
    }

    
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
        createTimelineTick(event);
        popupCont.remove()
    })

};

function createTimelineTick(event) {
    let filmDuration = draggedFilmDuration;
    let cardColor = draggedCardColor;

    let currentTimeline = event.target;


    let timelines = document.querySelectorAll('.timeline');
    for (let timeline of timelines) {

        const optionFilm = document.querySelectorAll('.film_option');
        const time = document.querySelector('.time').value;

        

        const tick = document.createElement('div');
        tick.className = 'timeline_tick tick_new';
        tick.setAttribute('seance_time', time)
        tick.id = draggedFilmId;
        

        optionFilm.forEach(option => {
            if (option.selected){
                tick.innerHTML = `${option.textContent}`;
            }
        });

        if (isSeanceExsists(currentTimeline, time)) {
            alert('Сеанс в это время уже существует!');
            return;
        }

        currentTimeline.appendChild(tick);

        // const optionsHalls = document.querySelectorAll('.hall_option');
        // optionsHalls.forEach(option => {
        //     if (option.selected) {
        //         if (timeline.id === option.id) {
        //             timeline.appendChild(tick);
        //         }
        //     }
        //     if(timeline.id === option.selected.id) {
        //         console.log(option.id)
        //         timeline.appendChild(tick);
        //     }
        // })

        let timeSet = {
            hours : +time.split(':')[0],
            minutes : +time.split(':')[1],
        };

        
        let totalMinutes = 60 * 24;
        let minuteInPercent = (totalMinutes / 100);
        let calculatedWidth = ((+filmDuration) / minuteInPercent).toFixed(2);
        let calculatedOffset = ((timeSet.hours * 60 + timeSet.minutes) / minuteInPercent).toFixed(2);
        
        let ticksArr = timeline.querySelectorAll('.timeline_tick');
        let ticksWidthSum = 0;

        ticksArr.forEach(elem => {ticksWidthSum += (+elem.style.width.split('%')[0])});

        tick.style.width = calculatedWidth + '%';
        tick.style.backgroundColor = cardColor;

        const footnoteBlocks = document.querySelectorAll('.footnotes');
        footnoteBlocks.forEach(block => {
            if (+currentTimeline.id === +block.id) {
                setOffsets();
                block.innerHTML += `<div class="time_footnote">${time}</div>`;
            }

            let timeFootnotes = block.querySelectorAll('.time_footnote');
            let elemWidthAcc = 0;

            timeFootnotes.forEach(elem => {                            
                if (timeFootnotes[0] !== elem) {
                    elemWidthAcc = +(elem.offsetWidth / (timeline.offsetWidth / 100)).toFixed(2);
                    elem.style.left += (calculatedOffset - elemWidthAcc) + '%';
                }
                else {
                    elem.style.left += calculatedOffset + '%';
                }
            })
        

        })
        return
    }
    
};

function isSeanceExsists(timeline, time) {
    let ticks = timeline.querySelectorAll('.timeline_tick');
    for (let tick of ticks) {
        if (tick.getAttribute('seance_time') === time) {
            return true;
        }
    }
    return false;
};

function randomizeColor() {
    const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]
};