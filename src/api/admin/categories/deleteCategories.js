import { connection } from "../../../db.js"; // Importuojamas duomenų bazės ryšys (prisijungimas)
import { IsValid } from "../../../lib/IsValid.js"; // Importuojama validacijos funkcija

export async function deleteCategories(req, res) { // Eksportuojama asinchroninė funkcija kategorijų trynimui
    const [err, msg] = IsValid.fields(req.params, { // Validuojami URL parametrai pagal taisykles
        url: 'nonEmptyString', // Tikrinama, ar 'url' parametras yra ne tuščias tekstas
    });
    /*🔍
req.params	Iš URL adreso kintamųjų (pvz., /user/:id)	Naudojama su GET, DELETE, PUT su URL kintamaisiais
req.body	Iš užklausos kūno (body), pvz., JSON ar formos NAUDOJAMAS SU POST*/

    if (err) { // Jei validacija nepraeina (klaida)
        return res.json({ // Grąžinamas JSON su klaidos statusu ir žinute
            status: 'error',
            msg: msg,
        });
    }

    const { url } = req.params; // Ištraukiamas 'url' parametras iš užklausos

    try {
        const sql = `DELETE FROM categories WHERE url_slug = ?;`; // SQL užklausa kategorijos trynimui pagal url_slug
        const [response] = await connection.execute(sql, [url]); // Vykdoma užklausa su parametru (apsauga nuo SQL injekcijų)

        if (response.affectedRows === 0) { // Jei nebuvo ištrinta nė viena eilutė (kategorija nerasta)
            return res.status(400).json({ // Grąžinamas 400 statusas ir klaidos pranešimas
                status: 'error',
                msg: 'Tokia kategorija neegzistuoja',
            });
        }
    } catch (error) { // Jei įvyko klaida vykdant užklausą
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinamas 500 serverio klaidos statusas ir žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    return res.status(200).json({ // Jei trynimas sėkmingas, grąžinamas 200 statusas ir sėkmės žinutė
        status: 'success',
        msg: 'Filmu kategorija istrinta sekmingai',
    });
}