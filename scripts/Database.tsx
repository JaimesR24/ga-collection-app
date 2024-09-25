import * as SQLite from 'expo-sqlite';
import { APICardData, APICardEdition } from '@/scripts/GA_Definitions';

const db = SQLite.openDatabaseAsync('ga-collection.db');

export async function setupDatabase(){
    await (await db).execAsync(`
        CREATE TABLE IF NOT EXISTS collections(
            c_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS ga_cards(
            collection_id INTEGER NOT NULL,
            card_slug TEXT NOT NULL,
            card_name TEXT NOT NULL,
            element TEXT NOT NULL,
            edition_slug TEXT NOT NULL,
            set_prefix TEXT NOT NULL,
            rarity TEXT NOT NULL,
            quantity INTEGER DEFAULT 0 NOT NULL,
            PRIMARY KEY (collection_id, edition_slug, rarity),
            FOREIGN KEY (collection_id) REFERENCES collections (c_id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
    console.log(`Database setup.`);
    return Promise<void>;
}

export async function getEverything(){
    const result = await (await db).getAllAsync(`SELECT * FROM collections JOIN ga_cards ON collection_id == c_id ORDER BY c_id`);
    return result;
}

export async function clearDatabase(){
    const query = `DROP TABLE IF EXISTS collections;
                   DROP TABLE IF EXISTS ga_cards;`
    await (await db).execAsync(query);
    console.log("Database cleared.");
    return Promise<void>;
}

export async function addCollection(name: string){
    await (await db).runAsync(`INSERT OR IGNORE INTO collections (name) VALUES ("${name}")`);
    console.log(`Added collection ${name}`);
    return Promise<void>;
}

export async function deleteCollection(c_id: number){
    await (await db).runAsync(`DELETE FROM collections where c_id == ${c_id};`);
    console.log(`Removed collection with id: ${c_id}`);
    return Promise<void>;
}

export async function getCollections(includeTotal: boolean = false){
    const result = await (await db).getAllAsync(`SELECT * FROM collections;`);
    console.log(`Returning collections...`);
    return includeTotal ? [{c_id: null, name: "Total"}, ...result] : result;
}

export async function getCollectionTotals(){
    const result = await (await db).getAllAsync(`SELECT c_id, name, IFNULL(SUM(quantity), 0) as total_cards FROM collections LEFT JOIN ga_cards ON c_id == collection_id GROUP BY c_id;`);
    console.log(`Returning collection totals...`);
    return result;
}

//this one gets a single copy of unique cards by name, regardless of edition prints
//c_id corresponds to the c_id key of the collection table
export async function getUniqueCards(c_id: number | null = null, strParam: string = ""){
    //if c_id == null/NaN, get all cards present in DB, regardless of collection
    const whereCondition = c_id || strParam != "" ? `WHERE ${c_id ? `collection_id == ${c_id}` : ""} 
                                                    ${c_id && strParam != "" ? " AND " : ""}
                                                    ${strParam != "" ? `card_name LIKE '%${strParam}%'` : ""}` : "";
    const result = await (await db).getAllAsync(`SELECT card_name AS name, element, SUM(quantity) AS quantity 
                                                FROM ga_cards
                                                ${whereCondition}
                                                GROUP BY card_slug
                                                ORDER BY card_slug, element;`);
    //console.log(`Result for c_id ${c_id} looking for ${strParam}: ${JSON.stringify(result)}`);
    return result;
}

export async function getEditionCards(slug: string, c_id: number | null = null){
    var query;
    //if no collection is passed, get every card separated by edition
    if (c_id) query = `SELECT set_prefix, card_slug AS slug, rarity, quantity FROM ga_cards WHERE collection_id == ${c_id} AND card_slug == "${slug}" ORDER BY set_prefix;`;
    else query = `SELECT set_prefix, card_slug AS slug, rarity, SUM(quantity) as quantity FROM ga_cards WHERE card_slug == "${slug}" GROUP BY set_prefix ORDER BY set_prefix;`

    //console.log(`Attempting query: ${query}`);
    const result = await (await db).getAllAsync(query);
    //console.log(`Result for c_id ${c_id} and slug ${slug}: ${JSON.stringify(result)}`);
    return result;
}

export async function modifyCards(c_id: number, card: APICardData, edition: APICardEdition, newQuantity: number){
    var query;
    if (newQuantity > 0){
        query = `
            INSERT INTO ga_cards VALUES (${c_id}, "${card.slug}", "${card.name}", "${card.element}", "${edition.slug}", "${edition.set.prefix}", ${edition.rarity}, ${newQuantity})
            ON CONFLICT (collection_id, edition_slug, rarity)
            DO UPDATE SET quantity = EXCLUDED.quantity;
        `;
    }
    else{
        query = `
            DELETE FROM ga_cards
            WHERE collection_id == ${c_id} AND
                  edition_slug == "${edition.slug}" AND
                  rarity == ${edition.rarity};
        `;
    }

    await (await db).runAsync(query);
    console.log(`Modified ${edition.slug} in collection_id ${c_id} to: ${newQuantity}`);
    return Promise<void>;
}

/*
INSERT INTO ga_cards VALUES (1, "lorraine-wandering-warrior", "Lorraine, Wandering Warrior", "NORM", "lorraine-wandering-warrior-doasd", "DOASD", 1, 1);
INSERT INTO ga_cards VALUES (1, "lorraine-crux-knight", "Lorraine, Crux Knight", "CRUX", "lorraine-crux-knight-doasd", "DOASD", 1, 1);
INSERT INTO ga_cards VALUES (2, "lorraine-wandering-warrior", "Lorraine, Wandering Warrior", "NORM", "lorraine-wandering-warrior-doasd", "DOASD", 1, 1);
INSERT INTO ga_cards VALUES (1, "lorraine-crux-knight", "Lorraine, Crux Knight", "CRUX", "lorraine-crux-knight-doap", "DOAp", 1, 1);

SELECT set_prefix, rarity, quantity FROM ga_cards WHERE collection_id == 1 AND card_slug == "lorraine-crux-knight" ORDER BY edition_slug;
*/