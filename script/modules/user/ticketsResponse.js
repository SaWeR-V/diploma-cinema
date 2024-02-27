import { getData } from "../../script.js";

export async function check() {
    const data = await getData();
    const films = data.films;
    const halls = data.halls;

    const header = document.querySelector('.header_container');
    const seanceBtns = document.querySelectorAll('.seance_btn');
    const hallWindow = document.querySelector('.hall_container');
    const cells = document.querySelectorAll('div.cell');
    const rows = document.querySelectorAll('div.row');

    let rowId = [];
    let cost = 0;
    let reservedCells = [];
    let dateOfSeance = document.querySelector('li.selected').innerText.trim();

    let selectedFilmId;
    let selectedSeanceId;
    let selectedSeanceTime; 
    let hallName;
    let filmName;
    
    
    rows.forEach(row => {
        if (row.querySelector('div.cell_active')){
            rowId.push(+row.id)
        }
    })

    cells.forEach(cell => {
        if (cell.classList.contains('cell_active')) {
            reservedCells.push(+cell.id);
            cost += (+cell.getAttribute('price'));
        }
    })

    hallWindow.classList.add('hidden');


    for (let btn of seanceBtns) {
        const clicked = btn.getAttribute('clicked');
    
        if (clicked === '1'){
            selectedFilmId = +btn.getAttribute('film_id');
            selectedSeanceId = +btn.getAttribute('seance_id');
            selectedSeanceTime = btn.textContent;
        }

        for (let hall of halls) {
            if (hall.id === +btn.id){
                hallName = hall.hall_name;
            }
        }
    };

    for (let film of films) {
        if (selectedFilmId === film.id) {
            filmName = film.film_name;
        }
    };
    
    
    header.insertAdjacentHTML('afterend', `
        <div class="check_header_container">
            <h2 class="check_header">Вы выбрали билеты:</h2>
        </div>
        <div class="check_main_container">
            <div class="check_main">
                <p class="paragraph">На фильм: <span class="boldered">${filmName}</span></p>
                <p class="paragraph">Места: <span class="boldered">${reservedCells}</span></p>
                <p class="paragraph">В зале: <span class="boldered">${hallName}</span></p>
                <p class="paragraph">Начало сеанса: <span class="boldered">${selectedSeanceTime}</span></p>
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
                            Время: ${selectedSeanceTime}, 
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
        ticketsResponse();
    });


    function ticketsResponse() {
        const selectedDate = document.querySelector('li.selected').firstElementChild.getAttribute('date');
        // console.log(selectedDate)
        const tickets = {
            row: rowId,
            place: reservedCells,
            coast: cost,
        };

        console.log(tickets)


        const params = new FormData();

        params.set('seanceId', selectedSeanceId)
        params.set('ticketDate', selectedDate)
        params.set('tickets', tickets)

        fetch('https://shfe-diplom.neto-server.ru/ticket', {
            method: 'POST',
            body: params

        })
        .then(response => response.json())
        .then(data => console.log(data))
    }
};

