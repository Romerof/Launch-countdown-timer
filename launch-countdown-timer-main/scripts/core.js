/**
 * @fileoverview Funciones constructoras de la tarjeta animada que se 
 * voltea con efectos 3D, y el objeto que maneja la cuenta regresiva
 * 
 * @version     1.0
 * @author      Javier Romero "Romerof"
 */

/**
 * Manejador del la cuenta regresiva
 * @constructor
 * @param launchTime {Date} fecha objetivo de la cuenta regresiva
 * @param updateHandler {callback} se ejecuta cada segundo, pasa un objeto con los datos del tiempo
 * @param finishHandler {callback} se ejecuta al finalizar la cuenta regresiva
 */
const CountDown = (()=>{
    function CountDown(launchTime,  updateHandler, finishHandler){
        this.launchTime = launchTime;
        this.onUpdate = updateHandler;
        this.onReached = finishHandler;
        this.state = "inactive";
    }

    CountDown.prototype.start = function start () { 
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
    }

    CountDown.prototype.stop = function stop () {
        this.state = "stoped";
        this?.timer && clearInterval(this.timer);
    }

    CountDown.prototype.remaining = function remaining () {
        if (this.finalDate === null) return;
        const remaining = (this.launchTime - Date.now()) / 1000; //segundos
        (remaining <= 0) && (this.state = "reached");
        return {
            remaining,
            d : Math.floor(remaining / 86400), //dias
            h : Math.floor(remaining / 3600 % 24), //horas
            m : Math.floor(remaining / 60 % 60), //minutos
            s : Math.floor(remaining % 60) //segundos
        }
    }

    return CountDown;
})()


/**
 * Construye y gestiona la card
 * @constructor
 * @param cardElement {object} contenedor de la card
 * @param timingOptions {object} keyframeOptions, opciones de la animación 
 * @param initial { number | string } texto que se muestra en el primer renderizado 
 */
const CardFlip = (()=>{
    function CardFlip (cardElement, timingOptions, initial = "00") {
        this.target = cardElement;
        this.layers = buildLayers(initial) //divs que giran en la animación
        this.flipAnimation = new CardFlipAnimation (timingOptions, this.layers)
        this.currentText = initial
        this.reverse = timingOptions?.direction === "reverse"

        addStyles(this.target, this.layers);
        addLayers(this.target, this.layers)
        CardRender.suscribe(this.target, this.layers);
    }

    
    CardFlip.prototype.change = function change (number){
        
        this.currentValue = number;
        this.currentText = ('0'+number).slice(-2)

        //primero o ultimo en cambiar, en caso de que la animación este en reverso
        const firstKey = this.reverse ? "front" : "back";
        const lastKey = this.reverse ? "back" : "front";
        const{ 
            [firstKey + "Top"] : firstTop, 
            [firstKey + "Bottom"] : firstBottom, 
            [lastKey + "Top"]: lastTop, 
            [lastKey + "Bottom"]: lastBottom
        } = this.layers; // destructuring

        firstTop.innerText = this.currentText;
        firstBottom.innerText = this.currentText;
     
        this.flipAnimation.play()
            .then(() => {
                lastTop.innerText = this.currentText;
                lastBottom.innerText = this.currentText;
            })
    }


    // "static"

    /**
     * actualiza los estilos de los layers al hacer zoom, o redimensionar la ventana
     */
    const CardRender = {
        suscriptors: [],
        suscribe(elem, layers){ this.suscriptors.push({elem, layers})},
        update(){
            this.suscriptors.forEach(e => addStyles(e.elem, e.layers))
        }
    }
    window.addEventListener('resize', CardRender.update.bind(CardRender));

    /**
     * fabrica de layers
     */
    function buildLayers(start){

        layers = {
            frontTop : document.createElement("div"),
            frontBottom : document.createElement("div"),
            backTop : document.createElement("div"),
            backBottom : document.createElement("div")
        } 

        for(key in layers) layers[key].innerText = start;
        return layers;
    }

    /**
    * Añade los estilos en linea a los layers, usa el tamaño de elem.
    * *** La función path no admite valores relativos.
    */
    function addStyles(elem, {frontTop, frontBottom, backTop, backBottom}){

        const width = () => elem.getBoundingClientRect().width;
        const height = () => elem.getBoundingClientRect().height * 0.92; //notar que es el 92%
        const w = p => p !== undefined ? (width() * (p/100)).toFixed(2) : width(); 
        const h = p => p !== undefined ? (height() * (p/100)).toFixed(2) : height(); 
        
        // w y p alias cortos de width y height 
        // w y h reciben un numero, si se especifica sera el porcentage del width o height
        // w y p sin argumento retornan el width o el height calculado respectivamente
        const topPath = `path('m 0,0 v ${h(45)} q ${w(5)},0 ${w(5)},${h(5)} h ${w(90)} q 0,-${h(5)} ${w(5)},-${h(5)} v -${h(50)} z')`;
        const bottomPath = `path('m 0,${h()} h ${w()} v -${h(45)} q -${w(5)},0 -${w(5)},-${h(5)} h -${w(90)} q 0,${h(5)} -${w(5)},${h(5)} z')`;

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

    // helpers
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
 * @param targets {object} objetos targets de la animacion (frontTop, backBottom)
 */
const CardFlipAnimation = (()=>{   
    
    function CardFlipAnimation (options, {frontTop: front, backBottom: back}) {
        this.options = {...options};
        //this.onfinish = null;
        this.targets = [front, back];

        const backKeyframe = new KeyframeEffect(
            back,
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
    
        const frontKeyframe = new KeyframeEffect(
            front,
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
    
    
        const frontAnimation = new Animation(frontKeyframe);
        const  backAnimation = new Animation(backKeyframe);

        this.animations = [frontAnimation, backAnimation]

    };

    CardFlipAnimation.prototype.play = function (){

        [front, back] = this.animations;
        const finished = new Promise( r => back.onfinish=r);

        this.animations.forEach( e => e.play() )

        return finished;
    }


    return CardFlipAnimation;
})()