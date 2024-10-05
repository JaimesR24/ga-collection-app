import * as SQLite from 'expo-sqlite';
import { APICardData, APICardEdition } from '@/scripts/GA_Definitions';

const db = SQLite.openDatabaseAsync('ga-collection.db');

//called on start up everytime.
export async function setupDatabase(){
    await (await db).execAsync(`
        CREATE TABLE IF NOT EXISTS collections(
            c_id INTEGER PRIMARY KEY,
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

//attempt to get all information by joining the tables
export async function getEverything(){
    const result = await (await db).getAllAsync(`SELECT * FROM collections JOIN ga_cards ON collection_id == c_id ORDER BY c_id`);
    return result;
}

//called within settings to reset the database
export async function clearDatabase(){
    await (await db).execAsync(`DROP TABLE IF EXISTS collections;
                                DROP TABLE IF EXISTS ga_cards;`);
    console.log("Database cleared.");
    return Promise<void>;
}

export async function resetDatabase(){
    await clearDatabase();
    await setupDatabase();
    console.log("Full reset complete.");
    return Promise<void>;
}

//add a new entry to the "collections" table. if an identical name is inside, it simply ignores the insert
export async function addCollection(name: string){
    await (await db).runAsync(`INSERT OR IGNORE INTO collections (name) VALUES ("${name}")`);
    console.log(`Added collection ${name}`);
    return Promise<void>;
}

//simply change the name of a collection
export async function editCollection(c_id: number, name: string){
    await (await db).runAsync(`UPDATE collections SET name = "${name}" WHERE c_id = ${c_id}`);
    //console.log();
    return Promise<void>;
}

//delete an entry from the "collections" table
export async function deleteCollection(c_id: number){
    await (await db).runAsync(`DELETE FROM collections WHERE c_id ==${c_id};`);
    console.log(`Removed collection with id: ${c_id}`);
    return Promise<void>;
}

//retrieve only the collections entries
export async function getCollections(includeTotal: boolean = false){
    const result = await (await db).getAllAsync(`SELECT * FROM collections;`);
    console.log(`Returning collections...`);
    return includeTotal ? [{c_id: null, name: "Total"}, ...result] : result;
}

//retrieve the collections entries as well as the total quantity of cards within each collection. making sure to return 0 instead of null if there are no card entries
export async function getCollectionTotals(){
    const result = await (await db).getAllAsync(`SELECT c_id, name, IFNULL(SUM(quantity), 0) as total_cards FROM collections LEFT JOIN ga_cards ON c_id == collection_id GROUP BY c_id;`);
    console.log(`Returning collection totals...`);
    return result;
}

//retrieve the entries of unique cards based on the card_slug attribute from the database. intended to be used in the "search" view
export async function getUniqueCards(c_id: number | null = null, strParam: string = "", limit: number = 50, offset: number = 0){
    //a string that holds logic to put into the main query based on which conditions it needs to check.
    //there is no guarantee that the collection, strParam, or both arguments will be checked, so this is necessary.
    const whereCondition = c_id || strParam != "" ? `WHERE ${c_id ? `collection_id == ${c_id}` : ""} 
                                                    ${c_id && strParam != "" ? " AND " : ""}
                                                    ${strParam != "" ? `card_name LIKE '%${strParam}%'` : ""}` : "";
    const output1 = await (await db).getAllAsync(`SELECT card_name AS name, element, SUM(quantity) AS quantity 
                                                FROM ga_cards
                                                ${whereCondition}
                                                GROUP BY card_slug
                                                ORDER BY CASE WHEN element == 'NORM' THEN 0
                                                              WHEN element == 'FIRE' THEN 1
                                                              WHEN element == 'WIND' THEN 2
                                                              WHEN element == 'WATER' THEN 3
                                                              WHEN element == 'CRUX' THEN 4
                                                              WHEN element == 'ARCANE' THEN 5
                                                              WHEN element == 'LUXEM' THEN 6
                                                              WHEN element == 'TERA' THEN 7
                                                              WHEN element == 'UMBRA' THEN 8
                                                              WHEN element == 'ASTRA' THEN 9
                                                              WHEN element == 'NEOS' THEN 10
                                                              WHEN element == 'EXIA' THEN 11 END, card_slug
                                                LIMIT ${limit} ${offset != 0 ? `OFFSET ${offset}`: ""};`);
    //secondary query to get the total cards for the purpose of resultInfo in the "search" view
    var output2 = await (await db).getFirstAsync(`SELECT COUNT(DISTINCT card_slug) AS card_count
                                                    FROM ga_cards
                                                    ${whereCondition}`) as any;
    output2.total_pages = Math.ceil(output2.card_count/limit);
    //console.log(`Attempting to get the amount of pages... quantity: ${output2.card_count}, result: ${Math.ceil(output2.card_count/limit)}`);
    output2.page_size = limit;
    //console.log(`Result for c_id ${c_id} looking for ${strParam}: ${JSON.stringify(result)}`);
    return {result: output1, info: output2};
}

//retrive the amount of cards in all edition prints that it has. used in the GA_EditionBox component.
export async function getEditionCards(slug: string, c_id: number | null = null){
    var query;
    //if no collection is passed, get everything as the "Total" collection
    if (c_id) query = `SELECT set_prefix, card_slug AS slug, rarity, quantity FROM ga_cards WHERE collection_id == ${c_id} AND card_slug == "${slug}" ORDER BY set_prefix;`;
    else query = `SELECT set_prefix, card_slug AS slug, rarity, SUM(quantity) as quantity FROM ga_cards WHERE card_slug == "${slug}" GROUP BY set_prefix ORDER BY set_prefix;`

    //console.log(`Attempting query: ${query}`);
    const result = await (await db).getAllAsync(query);
    //console.log(`Result for c_id ${c_id} and slug ${slug}: ${JSON.stringify(result)}`);
    return result;
}

//update the card quantity information based on the changed made with GA_EditionBox within the [ga_card] view
export async function modifyCards(c_id: number, card: APICardData, edition: APICardEdition, newQuantity: number){
    var query;
    //don't update a card to 0, delete it instead if there are no cards present.
    //it's presumed that you cannot have a negative card quantity, no point in keeping a 0 quantity entry.
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