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
    frame.addEventListener('click', () => {        
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
            console.log(seanceDesc)

            
            let hintBlock = seanceDesc.querySelector('.seancedesc_hint');

            

            if (window.outerWidth <= 768) {
                console.log(placesCont)

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

            function check() {
                const hallWindow = document.querySelector('div.hall_container');
                const cells = document.querySelectorAll('div.cell');
                const rows = document.querySelectorAll('div.row');
                let rowId = [];
                let cost = 0;
                let reservedCells = [];
                let dateOfSeance = document.querySelector('li.selected').innerText.trim();
                
                
                rows.forEach(row => {
                    if (row.querySelector('div.cell_active')){
                        rowId.push(row.id)
                    }
                })

                cells.forEach(cell => {
                    if (cell.classList.contains('cell_active')) {
                        reservedCells.push(cell.id);
                        cost += (+cell.getAttribute('price'));
                    }
                })

                hallWindow.classList.add('hidden');

                for (let hall of halls) {
                    if (hall.id === +btn.id) {
                        hallName = hall.hall_name;
                    };
                }

                for (let film of films) {
                    if (selectedFilmId === film.id) {
                        let filmName = film.film_name;


                header.insertAdjacentHTML('afterend', `
                    <div class="check_header_container">
                        <h2 class="check_header">Вы выбрали билеты:</h2>
                    </div>
                    <div class="check_main_container">
                        <div class="check_main">
                            <p class="paragraph">На фильм: <span class="boldered">${filmName}</span></p>
                            <p class="paragraph">Места: <span class="boldered">${reservedCells}</span></p>
                            <p class="paragraph">В зале: <span class="boldered">${hallName}</span></p>
                            <p class="paragraph">Начало сеанса: <span class="boldered">${selectedSeance}</span></p>
                            <p class="paragraph">Стоимость: <span class="boldered">${cost}</span> рублей</p>
                        </div>
                        <div class="get_code_container">
                            <button class="get_code" id="get_code">Получить код бронирования</button>
                        </div>
                        <div class="attention">
                            <p class="attention_paragraph">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                            <p class="attention_paragraph">Приятного просмотра!</p>
                        </div>
                    </div>
                `)
                
            let qrResult = QRCreator(`Дата: ${dateOfSeance},
                                    Время: ${selectedSeance}, 
                                    Название фильма: ${filmName}, 
                                    Зал: ${hallName}, 
                                    Ряд: ${rowId}, 
                                    Место: ${reservedCells}, 
                                    Стоимость: ${cost}.
                                    Билет действителен строго на свой сеанс.`
                    , {image: 'svg'});

            let qrContainer = document.createElement('div');
            qrContainer.className = 'qr_container fade_in';
            qrContainer.appendChild(qrResult.result)

            const getCode = document.querySelector('button.get_code');
            const attentionParargaphs = document.querySelectorAll('.attention_paragraph');

            getCode.addEventListener('click', () => {
                getCode.replaceWith(qrContainer);
                attentionParargaphs[0].innerText = 'Покажите QR-код нашему контроллеру для подтверждения бронирования.';
            })
            }; 
        }
    }
            
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
