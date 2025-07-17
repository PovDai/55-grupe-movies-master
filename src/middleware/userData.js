import { connection } from "../db.js";

// Middleware funkcija, kuri prideda vartotojo informaciją į req.user
export async function userData(req, res, next) {
    // Iš pradžių nustatome, kad vartotojas nėra prisijungęs
    req.user = {
        isLoggedIn: false,
    };

    // Tikriname, ar užklausoje yra slapukas "loginToken" ir ar jis turi reikiamą ilgį (20 simbolių)
    // Jei nėra tokio slapuko arba jis neteisingo formato, tiesiog einame prie kito middleware
    if (!req.cookies.loginToken || req.cookies.loginToken.length !== 20) {
        return next();
    }

    try {
        // Jei slapukas yra, bandome rasti vartotoją pagal tą prisijungimo tokeną duomenų bazėje
        const sql = `
            SELECT users.id, users.username, users.email,
                users.created_at AS user_created_at,
                login_tokens.created_at AS login_token_created_at
            FROM login_tokens
            INNER JOIN users
                ON login_tokens.user_id = users.id
            WHERE token = ?;`;

        // Vykdome SQL užklausą su slapuko reikšme kaip parametru
        const [results] = await connection.execute(sql, [req.cookies.loginToken]);

        // Jei nerandame arba randame daugiau nei vieną įrašą, praleidžiame (neprisijungęs)
        if (results.length !== 1) {
            return next();
        }

        // Jei radome vieną vartotoją, pridedame jo duomenis į req.user ir pažymime kaip prisijungusį
        req.user = {
            ...results[0],   // čia patenka: id, username, email, user_created_at, login_token_created_at
            isLoggedIn: true,
        };
    } catch (error) {
        // Jei įvyko klaida, ją išvedame į konsolę, bet neuždraudžiame programos veikimo
        console.log(error);
    }

    // Toliau perduodame valdymą kitam middleware ar maršrutui
    return next();
}

/*Kas čia vyksta:
Funkcija userData yra Express middleware, t.y. ji paleidžiama prieš bet kokį kitą maršrutą.

Ji patikrina, ar užklausoje yra galiojantis loginToken slapukas.

Jei slapukas yra, tai funkcija su jo pagalba paieško vartotoją duomenų bazėje.

Jei vartotojas rastas, jo duomenys pridedami į req.user objektą, ir isLoggedIn nustatoma į true.

Jei slapuko nėra arba jis negalioja, req.user.isLoggedIn lieka false.

Po to funkcija perduoda valdymą kitam middleware per next().*/