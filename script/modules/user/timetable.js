export function fillTimetable() {
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
    scrollTimetable();
};

function scrollTimetable() {
    const frames = document.querySelectorAll('.frame')
    let daysCounter = 0;
    const next = document.querySelector('.last_frame');
    next.addEventListener('click', () => {
        console.log('Нажали на кнопку next')
        daysCounter++;
        console.log(daysCounter)
        frames[0].classList.remove('selected');
        frames.forEach((frame, index) => {
            console.log(frames.lastIndexOf())
            // if (!frames.lastIndexOf()){
            //     frame.style.transform += `translateX(${-100}%)`;
            // }
        }
        );
        // frames[0].classList.add('hidden')
    })
}

