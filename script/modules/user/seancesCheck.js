import { addCards, showHall } from "../../script.js";

export function checkForSeances() {
    const blocks = document.querySelectorAll('.cinema_block');
    blocks.forEach(block => {
        if (!block.lastElementChild.classList.contains('halls')){
            block.remove()
        }
    })  
};


function updateSeanceButtons() {
    const time = new Date();
    const seanceBtns = document.querySelectorAll('.seance_btn');
    const hours = time.getHours();
    const minutes = time.getMinutes();

    seanceBtns.forEach(btn => {
        const btnTime = {
            hours : +btn.textContent.split(':')[0],
            minutes : +btn.textContent.split(':')[1]
        }

        if (hours > btnTime.hours || (hours === btnTime.hours && minutes >= btnTime.minutes)) {
            btn.disabled = true;
            btn.textContent = "N/A today";
        }
    });
}

export function checkForTimeOut() {
    const days = document.querySelectorAll('.frame');
    
    days.forEach(day => {
        day.addEventListener('click', () => {
            const choosenDay = document.querySelector('li.selected');
            if (choosenDay) {
                if (choosenDay.textContent.trim().includes('Сегодня')) {
                    updateSeanceButtons();
                } 
                else {
                    addCards();
                    checkForSeances();
                    showHall();
                }
            }
        });
    });

    updateSeanceButtons();
}


