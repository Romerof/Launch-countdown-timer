//const { map } = require("core-js/fn/dict");


//card
const c = {
    width: ()=>day.getBoundingClientRect().width,
    height: ()=>day.getBoundingClientRect().height * 0.92,
    w: (p) => p !== undefined ? (c.width() * (p/100)).toFixed(5) : c.width(), 
    h: (p) => p !== undefined ? (c.height() * (p/100)).toFixed(5) : c.height(), 
}




//front top
const frontTop = document.createElement("div");
const frontBottom = document.createElement("div");
const backTop = document.createElement("div");
const backBottom = document.createElement("div");


frontTop.innerHTML= `08`;
frontBottom.innerHTML= `08`;
backTop.innerHTML= `09`;
backBottom.innerHTML= `09`;

var i = 0;
window.onclick = () =>{ 
    change(++i);
}
window.addEventListener('resize', prepareCards)



prepareCards ()

const timing = {
    duration: 800,
    easing: "ease-in-out",
}


const dayAnimation = new CardFlipAnimation(timing, {frontTop, backBottom})


function change(n){

    backTop.innerText = n;
    backBottom.innerText = n;

    console.log(dayAnimation.play());
    dayAnimation.play()
        .then(() => {
            frontTop.innerText = n;
            frontBottom.innerText = n;
            backTop.style.background = 'red';
            backBottom.style.background = 'red';
        })

}



function prepareCards () {
    //tamaños
    // ${c.h(5)} ${c.h(45)} ${c.h(50)}
    // ${c.w(5)} {c.w(90)}
    const topPath = `path('m 0,0 v ${c.h(45)} q ${c.w(5)},0 ${c.w(5)},${c.h(5)} h ${c.w(90)} q 0,-${c.h(5)} ${c.w(5)},-${c.h(5)} v -${c.h(50)} z')`;
    const bottomPath = `path('m 0,${c.h()} h ${c.w()} v -${c.h(45)} q -${c.w(5)},0 -${c.w(5)},-${c.h(5)} h -${c.w(90)} q 0,${c.h(5)} -${c.w(5)},${c.h(5)} z')`;


    //styles
    const frontTopStyle = {
        filter: "brightness(.85)",
        zIndex: 10,
        clipPath: topPath,
        
    }
    const frontBottomStyle = {
        clipPath: bottomPath,
        zIndex: 10,
    }
    const backTopStyle = {
        ...frontTopStyle,
        zIndex: 0,
    }
    const backBottomStyle = {
        ...frontBottomStyle,
        transform: "rotateX(180deg)",
        zIndex: 20,
    }

    
    addStyle(frontTop, frontTopStyle);
    addStyle(frontBottom, frontBottomStyle);
    addStyle(backTop, backTopStyle);
    addStyle(backBottom, backBottomStyle);
    
    day.append(frontBottom, backBottom, frontTop, backTop);

}



secondsCard = new CardFlip(second, timing)
minutesCard = new CardFlip(minute, timing)
hoursCard = new CardFlip(hour, timing)
hoursCard = new CardFlip(hour, timing)



function addStyle(elem, styleObj){
    for (const key in styleObj) {
        elem.style[key] = styleObj[key];
        console.log(key)
    }
}




