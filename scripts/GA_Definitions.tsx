import * as Utils from '@/scripts/Utils';

//used by the Grand Archive Index to classify card rarity
export enum Rarity{
    C = 1,
    U = 2,
    R = 3,
    SR = 4,
    UR = 5,
    PR = 6,
    CSR = 7,
    CUR = 8,
    CPR = 9,
}

//change the rarity enum value into a string
export function getRarity(val: Rarity){
    //maybe output color?
    switch(val){
        case Rarity.C:
            return "Common";
        case Rarity.U:
            return "Uncommon";
        case Rarity.R:
            return "Rare";
        case Rarity.SR:
            return "Super Rare";
        case Rarity.UR:
            return "Ultra Rare";
        case Rarity.PR:
            return "Promotional Rare";
        case Rarity.CSR:
            return "Collector Super Rare";
        case Rarity.CUR:
            return "Collector Ultra Rare";
        case Rarity.CPR:
            return "Collector Promo Rare";
        default:
            return "-";
    }
}

//define the API request output (NOT CURRENTLY USED)
export type APIRequest = {
    page: number,
    total_cards: number,
    paginated_cards_count: number,
    page_size: number,
    has_more: boolean,
    sort: string,
    order: string,
    data: APICardData[],
};

//API request output, specifically for an individual card
export type APICardData = {
    uuid: string,
    types: string[],
    classes: string[],
    subtypes: string[],
    element: string,
    name: string,
    slug: string,
    effect: string,
    effect_raw: string,
    rule: {title: string, date_added: string, description: string},
    flavor: string,
    cost_memory: number | null,
    cost_reserve: number | null,
    level: number | null,
    power: number | null,
    life: number | null,
    durability: number | null,
    speed: boolean | null,
    related_ids: null,
    result_editions: APICardEdition[],
    editions: APICardEdition[],
}

//NOT USED. define the various parameters that could be used to query the Index for certain cards beyond just the name
export type APIParams = {
    page?: 1,
    page_size?: 50,
    sort?: "collector_number" | "rarity" | "name" | "cost_memory" | "cost_reserve" | "level" | "power" | "life" | "durability",
    order?: "ASC" | "DSC",
    slug?: string,
    name?: string,
    effect?: string,
    flavor?: string,
    rule?: string,
    element?: string | string[],
    type?: string | string[],
    type_logic?: "AND" | "OR",
    subtype?: string | string[],
    subtype_logic?: "AND" | "OR",
    class?: string | string[],
    class_logic?: "AND" | "OR",
    stats?: {},
    edition_slug?: string,
    collector_number?: string,
    prefix?: string,
    illustrator?: string,
    edition_effect?: string,
    edition_flavor?: string,
    legality?: { legality_format?:{limit?: number}}
}

//define the edition object that the Index returns
export type APICardEdition = {
    uuid: string,
    card_id: string,
    collector_number: string,
    slug: string,
    illustrator: string,
    rarity: number,
    effect: string | null,
    flavor: string | null,
    circulations: any[],
    circulationsTemplates: any[],
    set: {name: string, prefix: string, language: string}
}

//turn the element string from APICardData into a color
export function getElementColor(element: string){
    //console.log(`Testing element: ${element}`);
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
            return "#701715";
        default:
            return "black";
    }
}

//format the class array
function getClasses(classes: string[]){
    var firstIteration = true;
    var result = "";

    for (var entry of classes){
        entry = Utils.capitalizeFirstLetter(entry);
        if (isClass(entry)){
            if (firstIteration) firstIteration = false;
            else result += "/";
            result += `${entry}`;
        }
        else console.log(`Odd Warning: Input String ${entry} is not a Grand Archive class.`); 
    }
    return result;
}

//format the subtype array
function getSubtypes(subtypes: string[]){
    var firstIteration = true;
    var result = "";

    for (var entry of subtypes){
        entry = Utils.capitalizeFirstLetter(entry);
        if (!isClass(entry)){
            if (firstIteration) firstIteration = false;
            else result += " ";
            result += `${entry}`;
        }
    }
    return result;
}

//utilize the getClasses() and getSubtypes() methods to get a full string showing all main types and subtypes in a single line.
export function getFullTypes({types, classes, subtypes}: {types: string[], classes: string[], subtypes: string[]}){
    var output = "";
    for(var t of types) output += `${Utils.capitalizeFirstLetter(t)} `; 
    output += `- ${getClasses(classes)}`;
    output += ` ${getSubtypes(subtypes)}`;
    return output;
}

//check to see if the string passed is a valid Grand Archive class
function isClass(input: string){
    const classes = ['WARRIOR', 'MAGE', 'ASSASSIN', 'TAMER', 'RANGER', 'CLERIC', 'GUARDIAN'];
    return classes.includes(input.toUpperCase());
}

//check if the card is in the material deck or not
export function isMaterialCard(types: string[]){
    //console.log(`checking card types: ${JSON.stringify(types)}`);
    return types.includes("CHAMPION") || types.includes("REGALIA");
}

//check what type of card cost the card requires.
export function getCost(card: APICardData){
    var { type, cost } = isMaterialCard(card.types) ? {type: "Memory", cost: card.cost_memory} : {type: "Reserve", cost: card.cost_reserve};
    return `${type} Cost: ${cost}`;
}

//small helper function to help distinguish between 2 editions with the exact same prefix, but based on Kickstarter.
//makes those editions easy to see and distinguishable from the official release within the database and the GA_EditionBox
export function isKickstarter(slug: string){
    return /.-ks$/.test(slug);
}