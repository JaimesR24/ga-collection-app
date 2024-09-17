
export function mergeStrings(arr: string[], includeSpace: true){
    var output = "";
    for(var s in arr){
        output += `s${includeSpace ? " " : ""}`;
    }
    return output;
}

export function mergeArrays(a: any[], b: any[]){
    if (a == null) a = [];
    if (b == null) b = [];

    var temp = [];
    for (let x = 0; x < a.length; x++){
        temp[x] = a[x];
    }
    for (let x = 0; x < b.length; x++){
        temp[x + a.length] = b[x];
    }
    return temp;
}

export function capitalizeFirstLetter(input: string){
    input = input.toLowerCase();
    return input.charAt(0).toUpperCase() + input.slice(1);
}