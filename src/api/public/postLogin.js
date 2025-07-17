import { connection } from "../../db.js"; // Importuojamas duomenų bazės prisijungimas
import { COOKIE_MAX_AGE } from "../../env.js"; // Importuojamas slapuko galiojimo laikas iš aplinkos kintamųjų
import { hash } from "../../lib/hash.js"; // Importuojama funkcija slaptažodžio maišymui (hash)
import { IsValid } from "../../lib/IsValid.js"; // Importuojama validavimo biblioteka
import { randomString } from "../../lib/randomString.js"; // Importuojama funkcija atsitiktiniam string generavimui

/*{ KAS SLIEPIASI REQ.BODY  
  "username": "zuikis",
  "email": "zuikis@example.com",
  "password": "123456"
}*/
export async function postLogin(req, res) { // Eksportuojama asinchroninė funkcija prisijungimui
    const [err, msg] = IsValid.fields(req.body, { // Validuojami gaunami duomenys iš request body
        usernameOrEmail: 'nonEmptyString', // username arba email turi būti ne tuščias tekstas
        password: 'password', // password tikrinamas pagal specialius kriterijus (pvz. ilgis, simboliai)
    });

    if (err) { // Jei validacija nepavyko
        return res.json({ // Grąžinamas klaidos pranešimas JSON formatu
            status: 'error',
            msg: msg,
        });
    }

    const { usernameOrEmail, password } = req.body; // Iš request body paimami username/email ir slaptažodis
    let userObj = null; // Inicializuojamas kintamasis vartotojo duomenims saugoti

    try {
        const sql = `SELECT * FROM users WHERE username = ? OR email = ?;`; // SQL užklausa ieškoti vartotojo pagal username arba email ? reikalingi del injekciju apsaugoti sql
        const [response] = await connection.execute(sql, [usernameOrEmail, usernameOrEmail]); // Vykdoma užklausa su parametrais

        if (response.length === 0) { // Jei vartotojas nerastas
            return res.status(400).json({ // Grąžinama klaida (neteisingas prisijungimo duomenys)
                status: 'error',
                msg: 'Username/email ir password pora yra neteisinga',
            });
        }

        if (response.length > 1) { // Jei rasta daugiau nei vienas vartotojas (turi būti unikalus)
            return res.status(500).json({ // Serverio klaida, nes duomenų bazėje netvarka
                status: 'error',
                msg: 'Serverio klaida',
            });
        }

        userObj = response[0]; // Išsaugomas rastas vartotojas
    } catch (error) { // Jei vykdant užklausą įvyko klaida
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinama serverio klaidos žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    const hashedPassword = hash(password + userObj.salt); // Sugeneruojamas maišytas slaptažodis su saugumo soliavimo (salt) reikšme

    if (hashedPassword !== userObj.password_hash) { // Jei slaptažodžiai nesutampa
        return res.status(400).json({ // Grąžinama klaida, kad prisijungimo duomenys neteisingi
            status: 'error',
            msg: 'Username/email ir password pora yra neteisinga',
        });
    }

    const loginTokenString = randomString(); // Generuojamas atsitiktinis prisijungimo tokenas

    try {
        const sql = `INSERT INTO login_tokens (user_id, token) VALUES (?, ?);`; // SQL užklausa įrašyti prisijungimo tokeną į DB
        const [response] = await connection.execute(sql, [userObj.id, loginTokenString]); // Vykdoma užklausa su parametrais

        if (response.affectedRows !== 1) { // Jei neįrašyta tik viena eilutė
            return res.status(500).json({ // Grąžinama serverio klaidos žinutė
                status: 'error',
                msg: 'Serverio klaida',
            });
        }
    } catch (error) { // Jei vykdant įrašymą įvyko klaida
        console.log(error); // Klaida išvedama į konsolę
        return res.status(500).json({ // Grąžinama serverio klaidos žinutė
            status: 'error',
            msg: 'Serverio klaida',
        });
    }

    // Sukuriamas masyvas su slapuko parametrais
    const cookieParams = [
        'loginToken=' + loginTokenString, // Slapuko reikšmė su generuotu tokenu
        'domain=localhost', // Domenas, kuriame galioja slapukas
        'max-age=' + COOKIE_MAX_AGE, // Galiojimo trukmė sekundėmis
        'HttpOnly', // Slapukas nepasiekiamas JS kode (saugumo sumetimais)
        'path=/', // Slapukas galioja visam puslapiui
        'Secure', // Slapukas siunčiamas tik per HTTPS ryšį
        'SameSite=Lax', // Slapuko politikos nustatymas (apsauga nuo CSRF)
    ];

    return res
        .set({ 'Set-Cookie': cookieParams.join('; ') }) // Nustatomas slapukas atsakyme
        .json({ // Grąžinamas sėkmės atsakymas JSON formatu su peradresavimo informacija
            status: 'success',
            msg: 'Tu buvai sekmingai prijungtas prie sistemos',
            action: 'redirect',
            href: '/admin',
        });
}