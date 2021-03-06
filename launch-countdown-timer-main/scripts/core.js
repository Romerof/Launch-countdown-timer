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
 * @param targets {object} objetos targets de la animación frontTop, backBottom
 */
const CardFlip = (()=>{
    function CardFlip (cardElement, timingOptions, initial = "00") {
        this.target = cardElement;
        this.layers = buildLayers(initial) //divs que giran en la animación
        this.flipAnimation = new CardFlipAnimation (timingOptions, this.layers)
        this.currentText = initial
        this.reverse = timingOptions?.direction == "reverse"

        addStyles(this.target, this.layers);
        addLayers(this.target, this.layers)
        CardRender.suscribe(this.target, this.layers);
    }

    
    CardFlip.prototype.change = function (number){
        
        this.currentValue = number;
        this.currentText = ('0'+number).slice(-2)

        //firs and last to chage
        const firstKey = this.reverse ? "front" : "back";
        const lastKey = this.reverse ? "back" : "front";
        const{ 
            [firstKey + "Top"] : firstTop, 
            [firstKey + "Bottom"] : firstBottom, 
            [lastKey + "Top"]: lastTop, 
            [lastKey + "Bottom"]: lastBottom
        } = this.layers; 

        firstTop.innerText = this.currentText;
        firstBottom.innerText = this.currentText;
     
        this.flipAnimation.play()
            .then(() => {
                lastTop.innerText = this.currentText;
                lastBottom.innerText = this.currentText;
            })
    }


    //static

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
    window.addEventListener('resize', e => CardRender.update());

    /**
     * crea y devuelve los layers
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

    /* Añade los estilos en linea a los layers, usa el tamaño de elem
     * la funcion path para el recorte de los layers no admite valores 
     * relativos o dependientes de otro elemteto.
    */
    function addStyles(elem, {frontTop, frontBottom, backTop, backBottom}){

        const width = () => elem.getBoundingClientRect().width;
        const height = () => elem.getBoundingClientRect().height * 0.92; //notar que es el 92%
        const w = p => p !== undefined ? (width() * (p/100)).toFixed(2) : width(); 
        const h = p => p !== undefined ? (height() * (p/100)).toFixed(2) : height(); 
        
        // w y p alias cortos de width y height 
        // w y h recibe un numero, si se especifica este sera el porcentage del width o height
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