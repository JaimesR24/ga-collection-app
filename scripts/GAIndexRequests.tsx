const ga_index_root = "https://api.gatcg.com";

export function GA_nameSearchURL(name: string){
    return `${ga_index_root}/cards/search?name=${name}`;
}

export function GA_nameSlugURL(name: string){
    return `${ga_index_root}/cards/${name}`;
}

export function GA_advancedSearchURL(params: any){
    //base URL for a card search with no assumptions
    var URL = `${ga_index_root}/cards/search?`;

    var firstIteration = true;
    //loop through the attributes of params itself
    for(let attr in params){
        //check if the given attribute is a valid parameter and defined
        if (isValidGAParam(attr) && params[attr]){
            //'&' is required for multiple parameters, so only append the '&' before the subsequent parameters after the first iteration
            if (!firstIteration) URL += `&`;
            else firstIteration = false;
            //append to the URL
            URL += `${attr.toLowerCase()}=${params[attr]}`;
        }
    }

    return URL;
}

function isValidGAParam(input: string){
    const validParams = ["name", "effect", "element", "type", "subtype", "class", "prefix"];
    return validParams.includes(input.toLowerCase());
}

/*
export function GA_cardImageURL(slug: string, prefix: string, isCSR: boolean){
    return `https://ga-index-public.s3.us-west-2.amazonaws.com/cards/${slug}-${prefix}-${isCSR ? "CSR" : ""}.jpg`;
}
*/

export function GA_cardImageURL(editionSlug: string){
    return `https://ga-index-public.s3.us-west-2.amazonaws.com/cards/${editionSlug}.jpg`;
}


export function GA_elementIconURL(element: string){
    return `https://index.gatcg.com/images/icons/elements/${element}.png`;
}

//might have to change the input cause of multiple types, like regalia item specifically
export function GA_typeIconURL(type: string){
    //item and item-regalia are two different things
    //action, ally, champion, item, item-regalia, weapon
    return `https://index.gatcg.com/images/icons/types/${type}.png`;
}

export function GA_costIconURL(isMemory: false){
    return `https://index.gatcg.com/images/icons/${isMemory ? "memory" : "reserve"}_cost.png`;
}