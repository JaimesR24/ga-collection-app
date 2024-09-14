import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('@/ga-collection.db');

function setupDatabase(){
    const query = `
        CREATE TABLE [IF NOT EXISTS] collections(
            c_id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL UNIQUE
        )[WITHOUT ROWID];
        
        CREATE TABLE [IF NOT EXISTS] ga_cards(
            collection_id INTEGER NOT NULL,
            card_slug TEXT NOT NULL,
            card_name TEXT NOT NULL,
            element TEXT NOT NULL,
            edition_slug TEXT NOT NULL,
            set_prefix TEXT NOT NULL,
            rarity TEXT NOT NULL,
            quantity INTEGER DEFAULT 0 NOT NULL
            PRIMARY KEY (collection_id, card_slug, set_prefix)
            FOREIGN KEY collection_id REFERENCES collections (c_id) ON DELETE CASCADE ON UPDATE CASCADE
        )[WITHOUT ROWID];
    `;
}

//get all collections
export function getCollections(){
    const query = `SELECT name, SUM(quantity) as total_cards FROM collections JOIN ga_cards ON c_id == collection_id GROUP BY c_id ORDER BY c_id`;
}

//this one gets a single copy of unique cards by name, regardless of edition prints
//c_id corresponds to the c_id key of the collection table
export function getUniqueCards(c_id: number){
    //if c_id == null/NaN, get all cards    
    const query = `SELECT card_name, SUM(quantity) AS card_quantity FROM ga_cards WHERE collection_id == X GROUP BY card_slug ORDER BY card_slug, element`;
}

//this one differentiates between editions
export function getEditionCards(c_id: number, name: string){
    const query = `SELECT set_prefix, rarity, quantity FROM ga_cards WHERE collection_id == ${c_id} && card_name == ${name} ORDER BY edition_id`;

}

export function modifyCards(c_id: number, newQuantity: number){
    const query = ``;

}