// Importuojame klasę, kuri sugeneruoja 401 klaidos puslapį
import { PageError401 } from "../pages/public/Error401.js";

/**
 * Middleware funkcija, skirta tikrinti ar vartotojas yra prisijungęs.
 * Jei neprisijungęs, grąžina 401 klaidos puslapį.
 * Jei prisijungęs, leidžia tęsti užklausos apdorojimą.
 *
 * @param {object} req - Express užklausos objektas, kuriame yra vartotojo duomenys
 * @param {object} res - Express atsakymo objektas, kuriuo siunčiami duomenys klientui
 * @param {function} next - funkcija, skirta perduoti valdymą kitam middleware ar maršrutui
 */
export async function isAdmin(req, res, next) {
    // Patikriname ar vartotojas yra prisijungęs
    if (!req.user.isLoggedIn) {
        // Jei vartotojas nėra prisijungęs,
        // sukuriame naują 401 klaidos puslapio objektą, perduodame req objektą
        // ir laukiame, kol sugeneruos HTML su render()
        const errorPageHtml = await new PageError401(req).render();

        // Siunčiame sugeneruotą 401 klaidos puslapį vartotojui kaip atsakymą
        return res.send(errorPageHtml);
    }

    // Jei vartotojas yra prisijungęs, perduodame valdymą kitam middleware ar maršrutui
    return next();
}


/*req.user = { req.user — tai objektas, kuris saugo informaciją apie dabar prisijungusį vartotoją (angl. currently logged-in user) Express užklausos (req) metu.
    id: 123,
    username: "zuikis",
    email: "zuikis@example.com",
    isLoggedIn: true,
    role: "admin",
    login_token_created_at: new Date()
};*/