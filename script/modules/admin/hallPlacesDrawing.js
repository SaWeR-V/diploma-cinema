import { getData } from "../../main.js";
import { sendGrid } from "./sendGrid.js";

export async function hallCfgInjection() {
    const data = await getData();
    const halls = data.halls;

    
    let frame = document.querySelector('.halls');
    let hallPlaces = '';
    let row;
    let seat;
    let hallCfg = [];
    let btn = document.querySelector('.hall-cfg.config_selected')

    // configHallBtns.forEach((btn) => {

        for (let hall of halls) {

            if (hall.id === +btn.id) {
                row = hall.hall_rows;
                seat = hall.hall_places;
            }
        
            if (hall.id === +btn.id) {
                for (let i = 0; i < hall.hall_config.length; i++) {
                    hallCfg.push(...hall.hall_config[i]);
                }
            }   
            
        }
    // });


    hallPlaces += `<label class="annot_col">Рядов, шт
                            <input class="input" id="row" type="number" value="${row}" min="0">
                        </label>
                        <span class="multiplier">x</span>
                        <label class="annot_col">Мест, шт
                            <input class="input" id="seat" type="number" value="${seat}" min="0">
                        </label>
                        `;

    if (frame) {
        if (!frame.querySelector('div.places_quantity')) {
            frame.insertAdjacentHTML('beforeend', `
                <div class="places_quantity">
                    <p class="paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                    <div class="places_inputs">${hallPlaces}</div>
                </div>
                <div class="hall_map">
                    <p class="paragraph">Теперь Вы можете указать типы кресел на схеме зала:</p>
                    <div class="hall_map_legend">
                        <span class="cell"></span>
                            <p class="legend_annotation"> — обычные кресла</p>
                        <span class="cell vip"></span>
                            <p class="legend_annotation"> — VIP кресла </p>
                        <span class="cell disabled"></span>
                            <p class="legend_annotation"> — заблокированные (нет кресла)</p>
                    </div>
                    <p class="hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                    <div class="map_container" id="map_container"></div>
                    <div class="btns_container">
                        <button class="cancel" id="hall_discard_changes">Отмена</button>
                        <button class="save" id="places_grid">Сохранить</button>
                    </div>
                </div>
                `)
        };
    
    };


    const rowArea = document.getElementById('row');
    const seatArea = document.getElementById('seat');

    const mapContainer = document.getElementById('map_container');
    
    mapContainer.innerHTML = `<div class="places_container" id="places_container"></div>`;

    function drawHallGrid() {

    if (rowArea && seatArea) {
        rowArea.value = row;
        seatArea.value = seat;
        
        const placesContainer = document.getElementById('places_container');

        placesContainer.innerHTML = '';

        for (let i = 0; i < rowArea.value; i++) {
                const rowContainer = document.createElement('div');
                rowContainer.className = 'hall_row';
                    
            for (let k = 0; k < seatArea.value; k++) {
                const seat = document.createElement('div');
                seat.className = 'cell';
                rowContainer.appendChild(seat);
                }

            placesContainer.appendChild(rowContainer);
        }

        if (placesContainer) {
            const cells = document.querySelectorAll('div.cell');
            let currentStatusIndex = 0;
        
            for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                const cell = cells[cellIndex];
                const initStatus = hallCfg[cellIndex]; 
                cell.setAttribute('status', initStatus);
        
                const statuses = ['standart', 'vip', 'disabled'];
        
                cell.addEventListener('click', () => {
                    const newStatus = statuses[currentStatusIndex];
                    cell.setAttribute('status', newStatus); 
                    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        
                    cell.classList.remove(...statuses);
                    cell.classList.add(newStatus);
                });
        
                if (initStatus === 'standart') {
                    cell.classList.add('standart');
                } else if (initStatus === 'vip') {
                    cell.classList.add('vip');
                } else {
                    cell.classList.add('disabled');
                }
            }
        }
    }
    };
    
    drawHallGrid();
    
    if (rowArea) {
        rowArea.addEventListener('input', (event) => {
            const newRowValue = event.target.value;
            row = newRowValue;
            updatePlacesContainer(row, seat);
        });
    }

    if (seatArea) {
        seatArea.addEventListener('input', (event) => {
            const newSeatValue = event.target.value;
            seat = newSeatValue;
            updatePlacesContainer(row, seat);
        });
    }

    

    

    function updatePlacesContainer(newRow, newSeat) {
        const placesContainer = document.getElementById('places_container');
        placesContainer.innerHTML = '';
        
        for (let i = 0; i < newRow; i++) {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'hall_row';
        
            for (let k = 0; k < newSeat; k++) {
                const seat = document.createElement('div');
                seat.className = 'cell';
                rowContainer.appendChild(seat);
            }
        
            placesContainer.appendChild(rowContainer);
            }
    
            const cells = document.querySelectorAll('div.cell');
            let currentStatusIndex = 0;
    
            for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                const cell = cells[cellIndex];
                const initStatus = hallCfg[cellIndex]; 
                cell.setAttribute('status', initStatus);
        
                const statuses = ['standart', 'vip', 'disabled'];
        
                cell.addEventListener('click', () => {
                    const newStatus = statuses[currentStatusIndex];
                    cell.setAttribute('status', newStatus); 
                    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        
                    cell.classList.remove(...statuses);
                    cell.classList.add(newStatus);
                });
        
                if (initStatus === 'standart') {
                    cell.classList.add('standart');
                } else if (initStatus === 'vip') {
                    cell.classList.add('vip');
                } else {
                    cell.classList.add('disabled');
                }
            }
        };

    sendGrid();

    const discardChangesHall = document.getElementById('hall_discard_changes');
    discardChangesHall.addEventListener('click', () => {
        drawHallGrid();
    })

}