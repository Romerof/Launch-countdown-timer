
const timing = {
    duration: 800,
    easing: "ease-in-out",
}

const secondsCard = new CardFlip(second, timing)
const minutesCard = new CardFlip(minute, timing)
const hoursCard = new CardFlip(hour, timing)
const dayCard = new CardFlip(day, timing)


finalDate = new Date("2021/03/05 23:50");
//countdown
countDown = {
    finalDate,
    suscriptors: [],
    onUpdate: (rem) => console.log(rem),
    remaining(){
        if (this.finalDate === null) return;
        const remaining = (this.finalDate - Date.now()) / 1000
        return {
            remaining,
            d : (remaining / 86400).toFixed(),
            h : (remaining /3600 % 24).toFixed(),
            m : (remaining / 60 % 60).toFixed(),
            s : (remaining % 60).toFixed()
        }
    },
    timer: console.log(this),
    init(){
        return setInterval(function(){
            console.log(this);
            countDown.onUpdate(countDown.remaining());
        },1000,)
    },
}


//front top
const frontTop = document.createElement("div");
const frontBottom = document.createElement("div");
const backTop = document.createElement("div");
const backBottom = document.createElement("div");





