// Funkcija middleware, skirta išskaidyti (parsuoti) HTTP užklausos "Cookie" antraštę į atskirus raktas-reikšmė poras
export function cookieParser(req, res, next) {
    // Sukuriame tuščią objektą req.cookies, kuriame laikysime visas išskirtas cookies reikšmes
    req.cookies = {};

    // Patikriname, ar užklausos antraštėje yra cookie ir ar tai yra stringas
    if (typeof req.headers.cookie !== 'string') {
        // Jei cookie nėra arba tai ne stringas (pvz. undefined), tiesiog tęsiame į kitą middleware
        return next();
    }

    // Jei cookie yra, paimame visas cookie reikšmes, kurios yra viename stringe, atskirtame kabliataškiais ";"
    // Pavyzdžiui: "token=abc123; theme=dark"
    const cookieParts = req.headers.cookie
        .split(';')   // Padalina į masyvą: ["token=abc123", " theme=dark"]
        .map(s => s.trim()); // Pašalina tarpus abiejuose galuose, pvz. " theme=dark" -> "theme=dark"

    // Pereiname per kiekvieną cookie stringą
    for (const cookie of cookieParts) {
        // Randame lygybės ženklą "=" - jis skiria raktą nuo reikšmės
        const splitIndex = cookie.indexOf('=');

        // Paimame raktą nuo pradžios iki "="
        const key = cookie.slice(0, splitIndex);

        // Paimame reikšmę nuo "=" iki pabaigos
        const value = cookie.slice(splitIndex + 1);

        // Įrašome raktą ir reikšmę į req.cookies objektą
        req.cookies[key] = value;
    }

    // Tęsiame veikimą į kitą middleware
    return next();
}

/*Kaip šis pavyzdys atrodytų req.headers objekte?
js
Copy
Edit
{
  host: 'example.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  accept: 'text/html,application/xhtml+xml',
  cookie: 'loginToken=abc123; theme=dark',
  // ... gali būti ir daugiau antraščių
}*/

/*Ką reiškia kiekviena dalis?
host — į kurį serverį kreipiasi klientas

user-agent — informaciją apie naršyklę / klientą (pvz., kokia naršyklė, versija, OS)

accept — kokio tipo turinį klientas gali priimti

cookie — vartotojo sesijos ar kitų duomenų žymės, saugomos naršyklėje ir siunčiamos į serverį

Trumpai apie req.headers:
Tai yra standartinis HTTP protokolo dalykas — antraštės, kurios padeda serveriui suprasti užklausą

req.headers padeda serveriui apdoroti užklausą teisingai — pvz., žinoti, kas atsiuntė užklausą, kokio formato atsakymą norima, ar yra prisijungimo sesijos žymė ir pan.

Header pavadinimai yra mažosiomis raidėmis (toks Node.js standartas)

Dažniausiai naudojami headeriai:
cookie — vartotojo sesijos žymės

authorization — prisijungimo tokenai / autentifikacijos duomenys

content-type — kokio tipo duomenys siunčiami (pvz., JSON, form-data)

user-agent — informacija apie naršyklę ar programą

accept — kokius atsakymų formatus klientas priima*/