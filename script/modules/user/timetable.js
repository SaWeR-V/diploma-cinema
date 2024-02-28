export function fillTimetable() {
    const days = document.querySelectorAll('a.day');
    let today = new Date();
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Дек'];

    let dayOfWeek = daysOfWeek[today.getDay()];
    let month = months[today.getMonth()];

    days[0].innerHTML = `Сегодня <p>${dayOfWeek}, ${today.getDate()}</p>`;
    days[0].setAttribute('date', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
        
    for (let day = 1; day < days.length; day++) {
        today.setDate(today.getDate() + 1);
        dayOfWeek = daysOfWeek[today.getDay()];
        month = months[today.getMonth()];

        days[day].innerHTML = `${dayOfWeek}, <p>${today.getDate()} ${month}</p>`;
        days[day].setAttribute('date', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)

        if (dayOfWeek === daysOfWeek[0] || dayOfWeek === daysOfWeek[6]) {
            days[day].style.color = "#ff0000";
        }
    }

    addSelectListeners();
};

function scrollTimetable() {

    const next = document.querySelector('.last_frame');
    const back = next.cloneNode(true);
    back.className = 'frame first_frame';
    back.innerHTML = `<a href="#" class="back"><</a>`
    
    let daysCounter = 0;
    
    next.addEventListener('click', () => {
        let frames = document.querySelectorAll('.frame');
        if (daysCounter <= 14) {
            frames.forEach((frame, index) => {
                frame.classList.remove('selected');
                frames[1].insertAdjacentElement('beforebegin', back);

                if (!frame.classList.contains('last_frame') && !frame.classList.contains('first_frame')) {
                    if (daysCounter === index) {
                        frame.classList.add('hidden')
                    }
                }
            });
            daysCounter++;
            addNewDay();
        }
    });

    back.addEventListener('click', () => {
        let frames = document.querySelectorAll('.frame');
        if (daysCounter > 0) {
            frames.forEach((frame, index) => {
                frame.classList.remove('selected');
                if (!frame.classList.contains('last_frame') && !frame.classList.contains('first_frame')) {
                    if (daysCounter === index){
                        frame.classList.remove('hidden');
                    }
                }
            });
            
            daysCounter--;
            goToPreviousDay();
        }

        if (daysCounter === 0) {
            back.replaceWith(frames[0]);
            frames[0].classList.remove('hidden');
        }
    })

    function addNewDay() {
        next.previousElementSibling.insertAdjacentHTML('afterend', `<li class="frame"><a href="#" class="day"></a></li>`);
        fillTimetable();
    }

    function goToPreviousDay(){
        next.previousElementSibling.remove()
    }
};


scrollTimetable();

function addSelectListeners() {
    const frames = document.querySelectorAll('.frame');
    frames.forEach((frame) => {
        frame.addEventListener('click', () => {        
            frames.forEach((active) => {
                if(!frame.classList.contains('last_frame') && !frame.classList.contains('first_frame')){
                    active.classList.remove('selected')
                    frame.classList.add('selected')
                }
            })
        })
    });
}