import { getSeances } from "./getSeances.js";
import { setOffsets } from "./setOffsets.js";
import { drop } from "./dnd.js";

export function addSeances() {
    let timelines = document.querySelectorAll('.timeline');
    let seanceArr = []
    

    timelines.forEach(timeline => {
        let ticks = timeline.querySelectorAll('.timeline_tick');
        ticks.forEach(tick => {
            let arr = {
                seanceHallid : +tick.closest('.timeline').id,
                seanceFilmid : +tick.id,
                seanceTime : tick.getAttribute('seance_time'),
            };
            
            seanceArr.push(arr)
        })
    });
    
    for (let params of seanceArr) {
        let seanceHallid = params.seanceHallid;
        let seanceFilmid = params.seanceFilmid;
        let seanceTime = params.seanceTime;

    
        const values = new FormData()
        values.set('seanceHallid', `${seanceHallid}`)
        values.set('seanceFilmid', `${seanceFilmid}`)
        values.set('seanceTime', `${seanceTime}`)
        fetch('https://shfe-diplom.neto-server.ru/seance', {
            method: 'POST',
            body: values
        })

        .then( response => response.json())
        .then( data => console.log( data )); 
    }

    timelines.forEach(timeline => timeline.innerHTML = '');

    deleteSeances();
};


export async function deleteSeances() {
    await getSeances();
    let timeLines = document.querySelectorAll('.timeline');
    const footnotes = document.querySelectorAll('.time_footnote')
    const garbage = document.querySelector('.trash_bin');

    timeLines.forEach(timeline => {

        const ticks = timeline.querySelectorAll('.timeline_tick');
        ticks.forEach(tick => {
            let seanceTime = tick.getAttribute('seance_time');
            tick.draggable = true;
            
            tick.addEventListener('dragstart', (event) => {
                timeline.ondrop = null;
                garbage.classList.remove('hidden')

            })

            let isOverGarbage = false;
            garbage.addEventListener('dragover', (event) => {
                event.preventDefault();
                isOverGarbage = true;
            })

            garbage.addEventListener('dragleave', (event) => {
                isOverGarbage = false;
            });


            tick.ondragend = function (event) {
                event.preventDefault();

                if (isOverGarbage){
                    const deletableEl = event.target;
                    deletableEl.remove()

                    footnotes.forEach(elem => {
                        if (seanceTime === elem.textContent && elem.id === tick.id) {
                            elem.remove()
                        }
                    })

                    const seanceId = event.target.getAttribute('seance_id');

                    fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
                                method: 'DELETE',
                            })
                            .then( response => response.json())
                            .then( data => console.log( data ));
                };
         
            garbage.classList.add('hidden')
            setOffsets();
            timeline.ondrop = drop;
            }
        })
        
    })
};