/**
 * @fileoverview Funciones constructoras de la tarjeta, o ficha de cambio, animada con efectos 3D
 * 
 * @version     1.0
 * @author      Javier Romero "Romerof"
 */

/**
 * Construye y gestiona la card
 * @constructor
 * @param options {object} opciones del keyframe
 * @param targets {object} objetos targets de la animacion frontTop, backBottom
 */
const CardFlip = (()=>{
    function CardFlip (cardElement, timingOptions) {
        this.target = cardElement;
        this.layers = buildLayers()
        this.flipAnimation = new CardFlipAnimation (timingOptions, this.layers)

        addStyles(this.target, this.layers);
        addLayers(this.target, this.layers)
    }

    
    CardFlip.prototype.change = function (showable){
        const {backTop, backBottom, frontTop, frontBottom} = this.layers
        backTop.innerText = showable;
        backBottom.innerText = showable;
    
        this.flipAnimation.play()
            .then(() => {
                frontTop.innerText = showable;
                frontBottom.innerText = showable;
                
                backTop.style.background = 'red'; /** */
                backBottom.style.background = 'red'; /** */
            })
    }
    
    //static
    function buildLayers(){

        layers = {
            frontTop : document.createElement("div"),
            frontBottom : document.createElement("div"),
            backTop : document.createElement("div"),
            backBottom : document.createElement("div")
        } 
        return layers;
    }

    function addStyles(elem, {frontTop, frontBottom, backTop, backBottom}){

        const c = {
            width: ()=> elem.getBoundingClientRect().width,
            height: ()=> elem.getBoundingClientRect().height * 0.92,
            w: p => p !== undefined ? (c.width() * (p/100)).toFixed(5) : c.width(), 
            h: p => p !== undefined ? (c.height() * (p/100)).toFixed(5) : c.height(), 
        }
        
        const topPath = `path('m 0,0 v ${c.h(45)} q ${c.w(5)},0 ${c.w(5)},${c.h(5)} h ${c.w(90)} q 0,-${c.h(5)} ${c.w(5)},-${c.h(5)} v -${c.h(50)} z')`;
        const bottomPath = `path('m 0,${c.h()} h ${c.w()} v -${c.h(45)} q -${c.w(5)},0 -${c.w(5)},-${c.h(5)} h -${c.w(90)} q 0,${c.h(5)} -${c.w(5)},${c.h(5)} z')`;

        console.log(c);

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

    }

    function addLayers(elem, layers) {
        for(key in layers)
            elem.append(layers[key])
    }
    
    function addStyle(elem, styleObj){
        for (const key in styleObj) {
            elem.style[key] = styleObj[key];
        }
    }
    
    return CardFlip
})()


/**
 * Gestiona la animación de una card con simpleza y elegancia
 * @constructor
 * @param options {object} opciones del keyframe
 * @param targets {object} objetos targets de la animacion frontTop, backBottom
 */
const CardFlipAnimation = (()=>{   
    
    function CardFlipAnimation (options, {frontTop, backBottom}) {
        this.options = {...options};
        //this.onfinish = null;
        this.targets = [frontTop, backBottom];

        const backBottomKeyframe = new KeyframeEffect(
            backBottom,
            [
                { 
                    transform: "rotateX(90deg) translateY(-2px)",
                    borderColor: "hsl(234, 17%, 5%)",
                    filter: "brightness(1.3)",
                    opacity: 1,
                    offset: 0.50
                },
                {
                    transform: "rotateX(0deg)",
                    opacity: 1,
                }
            ], 
            options
        );
    
        const frontTopKeyframe = new KeyframeEffect(
            frontTop,
            [
                { 
                    transform: "rotateX(90deg) translateY(-2px)",
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

        return finished;
    }


    return CardFlipAnimation;
})()