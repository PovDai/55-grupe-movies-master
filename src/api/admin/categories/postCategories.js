import { connection } from "../../../db.js"; // Importuojamas duomenų bazės ryšys (prisijungimas)
import { IsValid } from "../../../lib/IsValid.js"; // Importuojama validacijos funkcija

export async function postCategories(req, res) { // Eksportuojama asinchroninė funkcija naujai kategorijai kurti
    const [err, msg] = IsValid.fields(req.body, { // Validuojami būtini laukai request body
        title: 'nonEmptyString', // title turi būti ne tuščias tekstas
        url: 'nonEmptyString', // url turi būti ne tuščias tekstas
        status: 'nonEmptyString', // status turi būti ne tuščias tekstas
    }, {
        description: 'nonEmptyString', // description yra neprivalomas, bet jei yra, turi būti ne tuščias tekstas
    });

    if (err) { // Jei validacija nepraeina
        return res.json({ // Grąžinamas JSON su klaidos statusu ir žinute
            status: 'error',
            msg: msg,
        });
    }

    const { title, url, status, description } = req.body; // Iš request body išskiriami reikalingi laukai

    try {
        const sql = `SELECT * FROM categories WHERE title = ? OR url_slug = ?;`; // SQL užklausa patikrinti, ar kategorija jau egzistuoja
        const [response] = await connection.execute(sql, [title, url]); // Vykdoma užklausa su parametrais (apsauga nuo SQL injekcijų)

        if (response.length > 0) { // Jei randama bent viena kategorija su tokiu pavadinimu arba URL
            return res.status(400).json({ // Grąžinamas 400 klaidos statusas ir pranešimas
                status: 'error',
                msg: 'Tokia kategorija jau egzistuoja',
            });
        }
    } catch (error) { // Jei įvyko klaida vykdant užklausą
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinamas 500 serverio klaidos statusas ir žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    try {
        const sql = `
            INSERT INTO categories (title, url_slug, status_id, description)
            VALUES (?, ?, 
                (SELECT id FROM general_status WHERE name = ?),
                ?);`; // SQL užklausa naujai kategorijai įterpti, status_id paimamas pagal statuso pavadinimą
        const [response] = await connection.execute(sql, [title, url, status, description]); // Vykdoma įterpimo užklausa su parametrais

        if (response.affectedRows !== 1) { // Jei neįterpta būtent viena eilutė
            return res.status(500).json({ // Grąžinamas 500 klaidos statusas ir pranešimas
                status: 'error',
                msg: 'Serverio klaida',
            });
        }
    } catch (error) { // Jei įvyko klaida vykdant įterpimą
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinamas 500 serverio klaidos statusas ir žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    return res.status(201).json({ // Jei viskas sėkminga, grąžinamas 201 statusas ir sėkmės žinutė
        status: 'success',
        msg: 'Sekmingai sukurta filmu kategorija',
    });
}