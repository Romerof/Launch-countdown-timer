


console.log(day);
console.log(hour);
console.log(minute);
console.log(second);

day.style.position="relative";
day.style.overflow="hidden";

const topColor = "hsl(236deg 21% 26%)";
const bottomColor =  "hsl(236deg 21% 26%)";
const color =  "hsl(345, 95%, 68%)";
let fontSize = "25px";

let  clipPath = 
"path("+
    "'M 0,0 "+
    "V 76 Q 4,76,4,80 H 143 Q 143,76,147,76 V 0 Z')";


//front top
const frontTop = document.createElement("div");
const frontBottom = document.createElement("div");





frontTop.innerHTML= ` <span> ${(day.offsetWidth/2).toFixed()} </span> `;
frontBottom.innerHTML= ` <span> ${(day.offsetWidth/2).toFixed()} </span> `;


fontSize = (day.offsetWidth * 0.55) +"px";
//day.style.lineHeight = "100%";

function change(){

}


day.append(frontTop);
day.append(frontBottom);

//styles
const topStyle = {
    background:topColor,
    filter: "brightness(.8)",
    clipPath
}
const bottomStyle = {
    background:bottomColor,
    clipPath: "inset(75.5% 0 0 0)"
}
const cardStyle = {
    paddingTop: "10%",
    fontSize,
    color,
    fontWeight: "700",
    width: "100%",
    height: "92%",
    position: "absolute",
    top: "0",
    left: "0",
    bottom: "0",
    borderRadius: "6%",
}

addStyle(frontTop, cardStyle);
addStyle(frontTop, topStyle);
addStyle(frontBottom, cardStyle);
addStyle(frontBottom, bottomStyle);

function addStyle(elem, styleObj){
    for (const key in styleObj) {
        elem.style[key] = styleObj[key];
        console.log(key);
    }
}
