export function addSeances() {
    let timelines = document.querySelectorAll('.timeline');
    let tickId;
    let seanceTime;
    let timelineId;
    

    timelines.forEach(timeline => {
        let ticks = timeline.querySelectorAll('.timeline_tick');
        ticks.forEach(tick => {
            seanceTime = tick.getAttribute('seance_time');
            tickId = +tick.id;
            
            timelineId = +tick.closest('.timeline').id
            console.log(timelineId)
            
        })
    });
    
    const params = new FormData()
    params.set('seanceHallid', `${timelineId}`)
    params.set('seanceFilmid', `${tickId}`)
    params.set('seanceTime', `${seanceTime}`)
    fetch('https://shfe-diplom.neto-server.ru/seance', {
        method: 'POST',
        body: params 
    })

    .then( response => response.json())
    .then( data => console.log( data ));    
};