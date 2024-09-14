export function getElementColor(element: string){
    switch(element.toUpperCase()){
        case "NORM":
            return "#6B6B6B";
        case "FIRE":
            return "#C20300";
        case "WIND":
            return "#0C7500";
        case "WATER":
            return "#005A8F";
        case "CRUX":
            return "#A04B96";
        case "ARCANE":
            return "#050069";
        case "LUXEM":
            return "#949442";
        case "TERA":
            return "#0C5F46";
        case "UMBRA":
            return "#2B005C";
        case "ASTRA":
            return "#523E7A";
        case "NEOS":
            return "#905827";
        case "EXIA":
        default:
            return "black";
    }
}

export function getSubtypes(subtypes: string[]){
    var firstIteration = true;
    var classes = "";
    var types = ""

    for (var s of subtypes){
        if (isClass(s)){
            if (!firstIteration) classes += `/`;
            else firstIteration = false;
            classes += `${s}`;
        }
        else types += ` ${s}`;
    }
    return classes + types;
}

function isClass(input: string){
    const classes = ['WARRIOR', 'MAGE', 'ASSASSIN', 'TAMER', 'RANGER', 'CLERIC', 'GUARDIAN'];
    return classes.includes(input.toUpperCase());
}