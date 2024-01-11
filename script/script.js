async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const data = await response.json();
    return data.result;
};

const frames = document.querySelectorAll('li.frame');
const nav = document.querySelector('nav');
const auth = document.querySelector('button.sign_in');
const header = document.querySelector('.header_container')

function fillTimetable() {
    const days = document.querySelectorAll('a.day');

    let today = new Date();
    let daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

    let dayOfWeek = daysOfWeek[today.getDay()];

    days[0].innerHTML = `Сегодня <p>${dayOfWeek}, ${today.getDate()}</p>`;
        
    for (let day = 1; day < days.length; day++) {
        today.setDate(today.getDate() + 1);
        dayOfWeek = daysOfWeek[today.getDay()];
        days[day].innerHTML = `${dayOfWeek}, <p>${today.getDate()}</p>`;

        if (dayOfWeek === daysOfWeek[0] || dayOfWeek === daysOfWeek[6]) {
            days[day].style.color = "#ff0000";
        }
    }
};

fillTimetable();

frames.forEach((frame) => {
    frame.addEventListener('click', ()=> {        
        frames.forEach((active) => {
            if(!frame.classList.contains('last_frame')){
                active.classList.remove('selected')
                frame.classList.add('selected')
            }
        })
    })
});

async function addCinemaCards() {
    const dataArr = await getData();
    const filmsDb = dataArr.films;
    const hallsDb = dataArr.halls;
    const seancesDb = dataArr.seances;

    console.log(dataArr)

    let htmlString = '';

for (let film of filmsDb) {
    let posters = film.film_poster;
    let id = film.id;
    let names = film.film_name;
    let descriptions = film.film_description;
    let durations = film.film_duration;
    let origins = film.film_origin;

    htmlString += `
        <section class="cinema_block" id="${id}">
            <div class="movie_info">
                <img class="poster" src="${posters}">
                <article class="movie_description">
                    <h3>${names}</h3>
                    <p class="description">${descriptions}</p>
                    <p class="origins">${durations} минут ${origins}</p>
                </article>
            </div>`;

    for (let hall of hallsDb) {
        let hallName = hall.hall_name;
        let seances = seancesDb.filter(seance => seance.seance_hallid === hall.id && seance.seance_filmid === id);

        if (seances.length > 0) {
            let seancesHTML = '';

            for (let seance of seances) {
                
                seancesHTML += `
                        <button class="seance_btn" id="${hall.id}" film_id="${film.id}">${seance.seance_time}</button>
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

    htmlString += `
            </div>
        </section>`;
}
    nav.insertAdjacentHTML('afterend', htmlString)
};

async function showHall() {
    await addCinemaCards();
    const dataArr = await getData();

    const seanceBtns = document.querySelectorAll('button.seance_btn');
    const cinemaBlocks = document.querySelectorAll('section.cinema_block');

    const halls = dataArr.halls;
    const films = dataArr.films;

    seanceBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
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

        for (let hall of halls) {
            if (hall.id === +btn.id){
                hallName = hall.hall_name
            }
        };

        for (let film of films){
            if (selectedFilmId === film.id) {
                let filmName = film.film_name;
    
            header.insertAdjacentHTML('afterend', `
                                <div class="hall_container fade_in">
                                    <section class="seance_description">
                                        <h3>${filmName}</h3>
                                        <p><span class="seance_starts">Начало сеанса: ${selectedSeance}</span></p>
                                        <h3>${hallName}</h3>
                                    </section>
                                        <div class="places_container">
                                            <div class="places" id="places">
                                                <div class="display">экран</div>
                                            </div>
                                            <div class="legend">
                                                <div class="cell_legend"> Свободно (250руб)</div>
                                                <div class="cell_legend_busy"> Занято</div>
                                                <div class="cell_legend_vip"> Свободно (350руб)</div>
                                                <div class="cell_legend_choosen"> Выбрано</div>
                                            </div>
                                        </div>
                                        <div class="book_container">
                                            <button class="book">Забронировать</button>
                                        </div>
                                </div>`);
                }
            };

        halls.filter(hall => { 
            if (hall.id === +btn.id) {
                for (let k = 0; k < hall.hall_places; k++) {
                    for (let i = 0; i < hall.hall_rows; i++) {
                        const placesCont = document.getElementById('places');
                        placesCont.insertAdjacentHTML('beforeend', `
                                <div class="cell">${(k * hall.hall_rows) + i + 1}</div>
                                `)
                    }
                }
            }
            else {
                return
                }
            const cells = document.querySelectorAll('div.cell');
            cells.forEach(cell => {
                cell.innerHTML = null;
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
                    cell.setAttribute('price', '')
                })
            };
            cells.forEach(cell => {
                if (cell.getAttribute('status') === 'vip') {
                    cell.classList.add('vip')
                    cell.setAttribute('price', 350)
                }
                else if (cell.getAttribute('status') === 'standart') {
                    cell.setAttribute('price', 250)
                }
                else {
                    cell.classList.add('disabled')
                    cell.removeAttribute('price', '')
                }
            })
            })

            function check(){
                const hallWindow = document.querySelector('div.hall_container');
                hallWindow.classList.add('hidden');

                header.insertAdjacentHTML('afterend', `
                    <div class="check_header_container">
                        <h2 class="check_header">Вы выбрали билеты:</h2>
                    </div>
                `)
            }

            const book = document.querySelector('button.book');
            book.addEventListener('click', () => {
                check();
            })
        })
    })

};

showHall();

auth.addEventListener('click', () => {
    console.log(`Нажата кнопка "${auth.textContent}" - открываем окно авторизации...`)

    location.href = './login.html';

})
