

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



const dayAnimation = new CardFlipAnimation(timing)


function change(n){

    backTop.innerText = n;
    backBottom.innerText = n;
    backTop.style.display = 'block';
    backBottom.style.display = 'block';



    backAnimation.onfinish = ()=>{
        console.log(backAnimation.playState);
        frontTop.innerText = n;
        frontBottom.innerText = n;
        
        backTop.style.display = 'none';
        backBottom.style.display = 'none';

    }
}

function addStyle(elem, styleObj){
    for (const key in styleObj) {
        elem.style[key] = styleObj[key];
    }
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
        zIndex: 10,
    }

    
    addStyle(frontTop, frontTopStyle);
    addStyle(frontBottom, frontBottomStyle);
    addStyle(backTop, backTopStyle);
    addStyle(backBottom, backBottomStyle);
    
    day.append(frontTop);
    day.append(frontBottom);
    day.append(backTop);
    day.append(backBottom);

}


// constructors and objects

const CardFlipAnimation = (()=>{   
    
    function CardFlipAnimation (options, {frontTop, backBottom}) {
        this.options = {...options};
        //this.onfinish = null;
        this.targets = [frontTop, backBottom];

        const backBottomKeyframe = new KeyframeEffect(
            backBottom,
            [
                { 
                    transform: "rotateX(90deg) translateY(-1px)",
                    borderColor: "hsl(234, 17%, 5%)",
                    filter: "brightness(1.3)",
                    offset: 0.50
                },
                {transform: "rotateX(0deg)"}
            ], 
            options
        );
    
        const frontTopKeyframe = new KeyframeEffect(
            frontTop,
            [
                { 
                    transform: "rotateX(90deg) translateY(1px)",
                    borderColor: "hsl(234, 17%, 5%)",
                    filter: "brightness(.6)",
                    offset: 0.50
                },
                {   transform: "rotateX(180deg)"}
            ], 
            options
        );
    
    
        const frontTopAnimation = new Animation(frontTopKeyframe);
        const  backBottomAnimation = new Animation(backBottomKeyframe);

        this.animations = [frontTopAnimation, backBottomAnimation]

    };

    CardFlipAnimation.prototype.play = function (){

        [front, back] = this.animations;
        const finished = new Promise( r => back.onfinish=r);

        this.animations.forEach( e => e.play() )

        return this.finished;
    }


    return CardFlipAnimation;
})()