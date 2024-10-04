const ga_index_root = "https://api.gatcg.com";

//API request for any cards using a certain passed string phrase and page number
export async function get_GA_NameSearch(name: string, page_number: number | null = null){
    var URL = `${ga_index_root}/cards/search?name=${name}`;
    if (page_number) URL += `&page=${page_number}`;
    try {
        console.log(`Search attempting to fetch with this url: ${URL}`);
        const response = await fetch(URL);
        console.log(`Response: ${JSON.stringify(response)}`);
        if (response == null) return null;
        const json = await response.json();
        return json;
    }
    catch(error){
        console.error(`Invalid JSON Output: ${error}`);
        return null;
    }
}

//API request URL for a single card using its card slug. WARNING. does not seem to function properly for some reason.
export function GA_nameSlugURL(name: string){ return `${ga_index_root}/cards/${name}`; }

//API request URL to search for cards based on various paremeters. not currently used.
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

//helper function for the GA_advancedSearchURL request
function isValidGAParam(input: string){
    const validParams = ["name", "effect", "element", "type", "subtype", "class", "prefix"];
    return validParams.includes(input.toLowerCase());
}

//return the source of a card's image based on the index's handling of images
export function GA_cardImageURL(editionSlug: string){
    return `https://ga-index-public.s3.us-west-2.amazonaws.com/cards/${editionSlug}.jpg`;
}

//return the source of an element's icon from the index
export function GA_elementIconURL(element: string){
    return `https://index.gatcg.com/images/icons/elements/${element}.png`;
}

//return the source of a card type's icon from the index. not currently implemented.
export function GA_typeIconURL(type: string){
    //item and item-regalia are two different things
    //action, ally, champion, item, item-regalia, weapon-regalia, weapon
    return `https://index.gatcg.com/images/icons/types/${type}.png`;
}

//return the source of the card cost icon from the index. dependent on regalia (blue) or memory (yellow) for the right icon
export function GA_costIconURL(isMemory: false){
    return `https://index.gatcg.com/images/icons/${isMemory ? "memory" : "reserve"}_cost.png`;
}