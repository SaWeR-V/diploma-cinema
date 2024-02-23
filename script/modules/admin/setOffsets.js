export function setOffsets() {
    let timelines = document.querySelectorAll('.timeline');
    timelines.forEach(timeline => {
        let ticksWidthSum = 0;
        let ticks = timeline.querySelectorAll('.timeline_tick');
        ticks.forEach(tick => {
            
            const seanceTime = tick.getAttribute('seance_time');         
            const timeSet = {
                hours : +seanceTime.split(':')[0],
                minutes : +seanceTime.split(':')[1],
            };

            let totalMinutes = 60 * 24;
            let minuteInPercent = totalMinutes / 100;

            let calculatedOffset = (timeSet.hours * 60 + timeSet.minutes) / minuteInPercent.toFixed(2);
            if(ticks[0] !== tick) {
                tick.style.left = (calculatedOffset - ticksWidthSum) + '%';
                ticksWidthSum += (+tick.style.width.split('%')[0]);
            }
            else if (ticks.length >= 2) {
                tick.style.left = (calculatedOffset - ticksWidthSum) + '%';
                ticksWidthSum += (+ticks[1].previousElementSibling.style.width.split('%')[0]);
            }
            else {
                tick.style.left = calculatedOffset + '%';
            }

        })
    })
            
};