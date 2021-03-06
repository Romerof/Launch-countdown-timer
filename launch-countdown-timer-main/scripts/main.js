"use strict";

const timing = {
    duration: 800, //ms
    easing: "ease-in-out",
    //direction: "reverse"
}

const secondsCard = new CardFlip(second, timing);
const minutesCard = new CardFlip(minute, timing);
const hoursCard = new CardFlip(hour, timing);
const daysCard = new CardFlip(day, timing);


const finalDate = new Date("2021/03/06 19:00");
//countdown


const countDown = {
    finalDate,
    suscriptors: [],
    onUpdate: (rem) => console.log(rem),
    onReached: () => console.log("finish hiiim!!!"),
    state: "inactive",
    remaining(){
        if (this.finalDate === null) return;
        const remaining = (this.finalDate - Date.now()) / 1000;
        (remaining <= 0) && (this.state = "reached");
        return {
            remaining,
            d : Math.floor(remaining / 86400), //dias
            h : Math.floor(remaining / 3600 % 24), //horas
            m : Math.floor(remaining / 60 % 60), //minutos
            s : Math.floor(remaining % 60) //segundos
        }
    },
    start(){ 
        this.state= "running";
        const timeHandler = (function () {
            const time = this.remaining();
            if (this.state === "reached") {
                this.stop();
                this.onReached();
            }else { this.onUpdate?.(time)};

        }).bind(this)

        this.stop()
        return this.timer = setInterval(timeHandler, 1000) ;
    },
    stop(){ 
        // retorna true si detiene el timer, false si no hay timer
        // leff
        return this.timer !== undefined 
            && !clearInterval(this.timer)
            && !(this.timer =undefined)
            || false;
    }
}

countDown.onUpdate = function(time){
    const {s, m, h, d} = time;
    secondsCard?.currentValue !== s && secondsCard.change(s);
    minutesCard?.currentValue !== m && minutesCard.change(m);
    hoursCard?.currentValue !== h && hoursCard.change(h);
    daysCard?.currentValue !== d && daysCard.change(d);

    console.log(time);
}
countDown.start()
console.log(countDown);


const CountDown = (()=>{
    function CountDown(launchTime,  updateHandler, finishHandler){
        
    }



})()





