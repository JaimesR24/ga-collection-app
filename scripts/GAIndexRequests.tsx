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

async function GA_sendRequest(url: string){
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json.data;
    }
    catch(error){
        console.error(error);
        return null;
    }
}