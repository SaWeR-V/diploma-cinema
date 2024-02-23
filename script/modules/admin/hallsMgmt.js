export async function sendNewHallCfg() {  
    const newHallName = document.getElementById('new_hall_popup_input');
    const popupCont = document.querySelector('div.popup_container');

    const params = new FormData()
    params.set('hallName', `${newHallName.value}`)
    const response = await fetch('https://shfe-diplom.neto-server.ru/hall', {
        method: 'POST',
        body: params 
    });

    const answer = await response.json();
    const result = answer.result;

    let halls = result.halls;

    popupCont.remove();

    const avialHalls = document.querySelectorAll('.halls_list');
    avialHalls.forEach(string => string.remove());

    const hallsListRefreshed = document.createElement('ul');
    hallsListRefreshed.className = 'halls_list';
    hallsListRefreshed.innerHTML = `<p class="paragraph">Доступные залы:</p>`;
    
    const paragraph = hallsListRefreshed.querySelector('.paragraph');
    let hallsString = '';

    for (let hall of halls) {
        let hallName = hall.hall_name;
        let hallId = hall.id;

        hallsString += `<li class="halls_list_item">${hallName}<button class="remove hall" id="${hallId}"></button></li>`;
    }

    paragraph.insertAdjacentHTML('afterend', `${hallsString}`);

    const createHall = document.querySelector('.create_hall');
    createHall.insertAdjacentElement('beforebegin', hallsListRefreshed);

    deleteHall();
};

export function deleteHall() {
    const removeHallBtns = document.querySelectorAll('button.remove.hall');

    removeHallBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            fetch(`https://shfe-diplom.neto-server.ru/hall/${+btn.id}`, {
            method: 'DELETE',
            })
            .then( response => response.json())
            .then( data => console.log( data ));
            
            btn.closest('li').remove();
        })
    })
};