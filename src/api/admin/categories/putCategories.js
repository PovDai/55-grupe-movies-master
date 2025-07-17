import { connection } from "../../../db.js"; // Importuojamas duomenų bazės ryšys (prisijungimas)
import { IsValid } from "../../../lib/IsValid.js"; // Importuojama validacijos funkcija

export async function putCategories(req, res) { // Eksportuojama asinchroninė funkcija kategorijos atnaujinimui
    const [errParams, msgParams] = IsValid.fields(req.params, { // Validuojami URL parametrai
        original_url: 'nonEmptyString', // original_url turi būti ne tuščias tekstas
    });

    if (errParams) { // Jei URL parametras netinkamas
        return res.json({ // Grąžinamas JSON su klaidos statusu ir žinute
            status: 'error',
            msg: msgParams,
        });
    }

    const [err, msg] = IsValid.fields(req.body, { // Validuojami būtini laukai body objekte
        title: 'nonEmptyString', // title turi būti ne tuščias tekstas
        url: 'nonEmptyString',   // url turi būti ne tuščias tekstas
        status: 'nonEmptyString', // status turi būti ne tuščias tekstas
    }, {
        description: 'nonEmptyString', // description yra neprivalomas, bet jei yra - ne tuščias tekstas
    });

    if (err) { // Jei body laukai netinkami
        return res.json({ // Grąžinamas JSON su klaidos statusu ir žinute
            status: 'error',
            msg: msg,
        });
    }

    const { original_url } = req.params; // Ištraukiamas original_url iš parametrų
    const { title, url, status, description } = req.body; // Ištraukiami duomenys iš request body

    try {
        const sql = `
            UPDATE categories
            SET title = ?, url_slug = ?, description = ?, status_id = (
                SELECT id FROM general_status WHERE name = ?
            )
            WHERE url_slug = ?`; // SQL užklausa atnaujinti kategorijos duomenis pagal originalų url_slug
        const [response] = await connection.execute(sql, [title, url, description, status, original_url]); // Vykdoma užklausa su parametrais

        if (response.affectedRows !== 1) { // Jei nebuvo atnaujinta būtent viena eilutė
            return res.status(500).json({ // Grąžinama klaida
                status: 'error',
                msg: 'Serverio klaida',
            });
        }
    } catch (error) { // Jei įvyko klaida vykdant užklausą
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinama 500 serverio klaidos žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    return res.status(200).json({ // Jei viskas pavyko, grąžinama sėkmės žinutė su 200 statusu
        status: 'success',
        msg: 'Sekmingai atnaujinta filmu kategorija',
    });
}