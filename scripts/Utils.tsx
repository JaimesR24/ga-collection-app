
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

export type Entry<Type1, Type2> = {
    key: Type1,
    value: Type2,
}

export class Dictionary<Type1, Type2>{
    entries: Array<Entry<Type1, Type2>>;

    constructor(dic?: Dictionary<Type1, Type2>){
        //shallow copy, improve this later if deep copies are necessary
        this.entries = dic ? dic.entries : new Array<Entry<Type1, Type2>>();
    }
    
    find(key: Type1){
        for (var entry of this.entries){
            if (entry.key == key) return entry;
        }
        return null;
    }

    has(key: Type1){ return this.find(key) != null; }

    get(key: Type1){
        var temp = this.find(key);
        return temp ? temp.value : null;
    }

    set(key: Type1, value: Type2){
        //console.log(`Setting ${key} to ${value}`);
        var entry = this.find(key);
        if (entry != null) entry.value = value;
        else this.entries.push({key: key, value: value} as Entry<Type1, Type2>);
        //console.log(`New update:\n ${this.toString()}`);
    }

    toString(){
        var output = "";
        for(var entry of this.entries) output += `Entry: key - ${entry.key}, value - ${entry.value}\n`; 
        return output;
    }
}
