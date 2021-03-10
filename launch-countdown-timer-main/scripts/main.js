"use strict";

const timing = {
    duration: 800, //ms, max: 1000
    easing: "ease-in-out",
    //direction: "reverse"
}

const secondsCard = new CardFlip(second, timing); //#second ...
const minutesCard = new CardFlip(minute, timing);
const hoursCard = new CardFlip(hour, timing);
const daysCard = new CardFlip(day, timing);

const finalDate = new Date('2021/03/22');

function timeHandler (time){
    const {s, m, h, d} = time;
    secondsCard?.currentValue !== s && secondsCard.change(s);
    minutesCard?.currentValue !== m && minutesCard.change(m);
    hoursCard?.currentValue !== h && hoursCard.change(h);
    daysCard?.currentValue !== d && daysCard.change(d);
}

function finishHandler() {
    /// on finish 
}

//countdown
const countDown = new CountDown(finalDate, timeHandler, finishHandler);
countDown.start();


//play/stop *extra*
const motions = document.getAnimations().filter( a => a instanceof CSSAnimation );

btn_motion.addEventListener("click", (e)=>{
    e.currentTarget
     .classList
     .toggle("play") 
    ? motions.forEach( a => a.cancel())
    : motions.forEach( a => a.play());
});



