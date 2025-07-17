import { connection } from "../../db.js";

export async function getAllCategories() {
    try {
        const sql = `
            SELECT
                categories.*,                 -- paimame visas kategorijų lentelės stulpelius
                0 AS moviesCount,             -- grąžiname stulpelį moviesCount su reikšme 0 (kol kas nepanaudota)
                general_status.name AS statusName  -- pridedame statuso pavadinimą iš general_status lentelės
            FROM categories
            INNER JOIN general_status
                ON categories.status_id = general_status.id;`;  // sujungiame pagal statuso id

        const [result] = await connection.execute(sql);  // vykdome SQL užklausą
        return result;  // grąžiname gautą rezultatą (masyvą su kategorijomis)
    } catch (err) {
        return [];  // jei klaida, grąžiname tuščią masyvą
    }
}