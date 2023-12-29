async function getData() {
    const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
    const data = await response.json();
    return data.result;
};

const frames = document.querySelectorAll('li.frame');
const nav = document.querySelector('nav');
const auth = document.querySelector('button.sign_in');

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
                        <button class="seance_btn" id="${seance.id}">${seance.seance_time}</button>
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
    const seanceBtns = document.querySelectorAll('button.seance_btn');
    const cinemaBlocks = document.querySelectorAll('section.cinema_block');

    seanceBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            cinemaBlocks.forEach((block) => {
                block.remove()
        });
            nav.remove();
            auth.remove();
        })
    })
};

showHall();
