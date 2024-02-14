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
};