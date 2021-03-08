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


const finalDate = new Date("2021/03/06 22:57");


function timeHandler (time){
    const {s, m, h, d} = time;
    secondsCard?.currentValue !== s && secondsCard.change(s);
    minutesCard?.currentValue !== m && minutesCard.change(m);
    hoursCard?.currentValue !== h && hoursCard.change(h);
    daysCard?.currentValue !== d && daysCard.change(d);
}

//countdown
const countDown = new CountDown(finalDate, timeHandler, ()=>console.log("finish"));
countDown.start();



