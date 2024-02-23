import { getData } from "../../main.js";
import { setOffsets } from "./setOffsets.js";

export async function getSeances() {
    const data = await getData();

    let films = data.films;
    let seances = data.seances;

    let timeLines = document.querySelectorAll('.timeline');
    timeLines.forEach(timeline => {
        const timelineSeances = seances.filter(seance => +timeline.id === seance.seance_hallid);
        timelineSeances.forEach(seance => {
            const film = films.find(film => seance.seance_filmid === film.id);
                    timeline.innerHTML += `<div class="timeline_tick" id="${film.id}" duration="${film.film_duration}" seance_time="${seance.seance_time}" seance_id="${seance.id}">${film.film_name}</div>`;
                })
                
                const timelineTicks = timeline.querySelectorAll('.timeline_tick');
                timelineTicks.forEach(tick => {
                    const filmDuration = tick.getAttribute('duration');
                    const seanceTime = tick.getAttribute('seance_time');
                            
                    const timeSet = {
                        hours : +seanceTime.split(':')[0],
                        minutes : +seanceTime.split(':')[1],
                    };

                    let totalMinutes = 60 * 24;
                    let minuteInPercent = totalMinutes / 100;
                    let calculatedWidth = (+filmDuration / minuteInPercent).toFixed(2);
                    let calculatedOffset = (timeSet.hours * 60 + timeSet.minutes) / minuteInPercent.toFixed(2);

                    tick.style.width = calculatedWidth + '%';
                    tick.style.left = calculatedOffset + '%';   


                    const footnoteBlocks = document.querySelectorAll('.footnotes');
                    footnoteBlocks.forEach(block => {
                        if (+timeline.id === +block.id) {
                            block.innerHTML += `<div class="time_footnote" id="${tick.id}">${seanceTime}</div>`;
                        }

                        setOffsets();

                        let timeFootnotes = block.querySelectorAll('.time_footnote');
                        let elemWidthAcc = 0;
        
                        timeFootnotes.forEach(elem => {                            
                            if (timeFootnotes[0] !== elem) {
                                elemWidthAcc += +(elem.offsetWidth / (timeline.offsetWidth / 100)).toFixed(2);
                                elem.style.left += (calculatedOffset - elemWidthAcc) + '%';
                            }
                            else {
                                elem.style.left += calculatedOffset + '%';
                            }
                        })
                    })

                    const filmCards = document.querySelectorAll('.film_card');
                    filmCards.forEach(filmCard => {
                        if (filmCard.id === tick.id) {
                            tick.style.backgroundColor = filmCard.style.backgroundColor;
                        }
                    })
                })
            })         
};