import { connection } from "../../db.js"; // Importuojama DB prisijungimo konfigūracija
import { hash } from "../../lib/hash.js"; // Importuojama slaptažodžio maišymo funkcija
import { IsValid } from "../../lib/IsValid.js"; // Importuojama duomenų validavimo biblioteka
import { randomString } from "../../lib/randomString.js"; // Importuojama atsitiktinių stringų generavimo funkcija

export async function postRegister(req, res) { // Eksportuojama asinchroninė funkcija registracijai
    const [err, msg] = IsValid.fields(req.body, { // Validuojami gaunami request body laukai
        username: 'username', // Naudojamas username validavimo taisyklių rinkinys
        email: 'email',       // Naudojamas email validavimo rinkinys
        password: 'password', // Slaptažodžio validavimas
        tos: 'tos',           // "Terms of Service" patvirtinimas (pvz., checkbox true)
    });

    if (err) { // Jei validacija nepraeina
        return res.json({ // Grąžinamas klaidos pranešimas JSON formatu
            status: 'error',
            msg: msg,
        });
    }

    const { username, email, password } = req.body; // Iš request body išskiriami vartotojo duomenys

    try {
        const sql = `SELECT * FROM users WHERE username = ? OR email = ?;`; // Užklausa patikrinti, ar jau yra toks vartotojas
        const [response] = await connection.execute(sql, [username, email]); // Vykdoma užklausa

        if (response.length > 0) { // Jei jau egzistuoja vartotojas su tokiu username arba email
            return res.status(400).json({ // Grąžinama klaida
                status: 'error',
                msg: 'Toks vartotojas jau uzregistruotas',
            });
        }
    } catch (error) { // Jei įvyko klaida vykdant užklausą
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinama serverio klaida
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    const salt = randomString(10); // Sugeneruojamas atsitiktinis 10 simbolių ilgumo salt'as
    const passwordHash = hash(password + salt); // Sugeneruojamas slaptažodžio hash'as su salt'u

    try {
        const sql = `INSERT INTO users (username, email, salt, password_hash) VALUES (?, ?, ?, ?);`; // Užklausa įrašyti naują vartotoją
        const [response] = await connection.execute(sql, [username, email, salt, passwordHash]); // Vykdoma užklausa su parametrais

        if (response.affectedRows !== 1) { // Jei neįrašyta tik viena eilutė (klaida)
            return res.status(500).json({ // Grąžinama serverio klaida
                status: 'error',
                msg: 'Serverio klaida',
            });
        }
    } catch (error) { // Klaidų tvarkymas
        if (error.code === 'ER_DUP_ENTRY') { // Jei pasikartojo įrašas dėl unikalumo apribojimų
            return res.status(500).json({
                status: 'error',
                msg: 'kartojasi irasas...', // Galima pakeisti į aiškesnį pranešimą
            });
        }

        console.log(error); // Kitų klaidų atveju klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinama serverio klaida
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    return res.status(201).json({ // Jei registracija sėkminga, grąžinamas atsakymas su status 201 (created)
        status: 'success',
        msg: 'Sekminga registracija',
    });
}