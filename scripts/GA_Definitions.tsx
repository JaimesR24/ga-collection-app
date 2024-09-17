export type APIRequest = {
    page: number,
    total_cards: number,
    paginated_cards_count: number,
    page_size: number,
    has_more: boolean,
    sort: string,
    order: string,
    data: APICardData,
};

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
    legality_format?: null,
    legality_limit?: number,
}

type APICardEdition = {
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

export function isMaterialCard(card: APICardData){
    return card.types.includes("CHAMPION") || card.types.includes("REGALIA");
}