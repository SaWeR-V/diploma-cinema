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
    const next = document.querySelector('.last_frame');
    const back = next.cloneNode(true);
    back.className = 'frame first_frame';
    back.innerHTML = `<a href="#" class="back"><</a>`
    const weekCont = document.querySelector('.week_container');
    let daysCounter = 0;

    next.addEventListener('click', () => {
        // console.log(daysCounter)
        frames.forEach((frame, index) => {
            frame.classList.remove('selected');
            frames[0].replaceWith(back)
            if (!frame.classList.contains('last_frame') && !frame.classList.contains('first_frame')) {
                frame.style.transform = `translateX(${-100 * daysCounter}%)`;
                // }
                    // console.log(frame.getBoundingClientRect())

                    // frame.classList.add('hidden')
            }

            
        });
        daysCounter++;
        console.log(daysCounter)
        console.log(next.previousElementSibling)
        next.previousElementSibling.insertAdjacentHTML('afterend', `<li class="frame smooth_in"><a href="#" class="day"></a></li>`)
        fillTimetable()
        // frames[0].classList.add('hidden')
    })

    back.addEventListener('click', () => {
        // console.log(daysCounter)
        frames.forEach((frame, index) => {
            frame.classList.remove('selected');
            if (!frame.classList.contains('last_frame') && !frame.classList.contains('first_frame')) {
                frame.style.transform += `translateX(${100 * daysCounter}%)`;
                // }
                    // console.log(frame.getBoundingClientRect())

                    // frame.classList.add('hidden')
            }

            
        });
        daysCounter--;
        console.log(daysCounter)
        // frames[0].classList.add('hidden')
    })
}

