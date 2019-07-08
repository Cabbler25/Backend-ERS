import Cat from "models/Cat";

let catCounter: number = 1;
const catMap: Map<Number, Cat> = new Map();

export function createCat(cat): Cat {
    cat.id = catCounter++;
    // registering key-value pair
    // so I can later retrieve cats by id
    catMap.set(cat.id, cat);
    return cat;
}

export function getCatById(id: number) {
    return catMap.get(id);
}