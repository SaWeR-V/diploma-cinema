import { hallCfgInjection } from "./hallPlacesDrawing.js";
export function sendGrid() {

    const arrayConfig = [];
    let hallGridBlock = document.querySelector('div.hall_map');

    if (hallGridBlock) {
        const savePlacesGrid = document.getElementById('places_grid');

        savePlacesGrid.addEventListener('click', () => {
            const iterableRows = document.querySelectorAll('div.hall_row');
            iterableRows.forEach(row => {
                const cells = row.querySelectorAll('div.cell');
                const rowArr = [];

                cells.forEach(cell => {
                    rowArr.push(cell.getAttribute('status'));
                });
        
                arrayConfig.push(rowArr)
            });

            const rowArea = document.getElementById('row');
            const seatArea = document.getElementById('seat');
            const currentHall = document.querySelector('.hall-cfg.config_selected');
            
            const params = new FormData()
                params.set('rowCount', `${rowArea.value}`)
                params.set('placeCount', `${seatArea.value}`)
                params.set('config', JSON.stringify(arrayConfig))
                fetch(`https://shfe-diplom.neto-server.ru/hall/${+currentHall.id}`, {
                    method: 'POST',
                    body: params 
                })
                    .then( response => response.json())
                    .then( data => console.log( data ));

            document.getElementById('hall_discard_changes').disabled = true;
            savePlacesGrid.disabled = true;

            hallCfgInjection();
        })  
    };
};