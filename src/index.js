import express from 'express';
import { PORT } from './env.js';
import { PageError404 } from './pages/public/Error404.js';
import { publicPageRouter } from './routes/publicPageRouter.js';
import { publicApiRouter } from './routes/publicApiRouter.js';
import { adminPageRouter } from './routes/adminPageRouter.js';
import { cookieParser } from './middleware/cookieParser.js';
import { userData } from './middleware/userData.js';
import { isAdmin } from './middleware/isAdmin.js';
import { adminApiRouter } from './routes/adminApiRouter.js';

// Sukuriame Express programos objektą
const app = express();

// Naudojame vidutinį sluoksnį (middleware), kuris aptarnauja statinius failus iš 'public' katalogo
// Tai leidžia klientams (naršyklėms) tiesiogiai prieiti prie CSS, JS, paveikslėlių ir pan.
app.use(express.static('public'));

// Middleware, kuris automatiškai išanalizuoja JSON formato užklausų kūną (body)
// Tai leidžia patogiai pasiekti duomenis per req.body
app.use(express.json());

// Naudojame middleware, kuris skaito ir apdoroja cookies (slapukus) iš užklausų
// Tai leidžia paprastai naudoti slapukus per req.cookies
app.use(cookieParser);

// Naudojame savą middleware userData, kuris greičiausiai patikrina prisijungusį vartotoją,
// nuskaito jo duomenis, pvz., iš slapuko ar tokeno, ir prideda juos prie req.user ar pan.
app.use(userData);

// Prijungiame maršrutizatorių (router), kuris tvarko visas viešas puslapių užklausas
// Pavyzdžiui: GET /, GET /movies, GET /categories ir pan.
app.use('/', publicPageRouter);

// Prijungiame viešą API maršrutizatorių, kuris tvarko viešus API endpoint'us,
// pavyzdžiui registraciją, prisijungimą (POST /api/register, POST /api/login)
app.use('/api', publicApiRouter);

// Prijungiame administracinių puslapių maršrutizatorių, kuris prieinamas tik administratoriams
// Middleware 'isAdmin' tikrina, ar vartotojas yra adminas prieš leidžiant pasiekti šiuos puslapius
app.use('/admin', isAdmin, adminPageRouter);

// Prijungiame administracinės API dalies maršrutizatorių, kuris taip pat reikalauja admin teisių
app.use('/api/admin', isAdmin, adminApiRouter);

// Globalus klaidų apdorojimo middleware (error handler)
// Jei koks nors middleware ar route sukelia klaidą ir ją perduoda čia,
// ji bus užfiksuota, išspausdinta į konsolę ir vartotojui bus grąžintas 500 atsakymas
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).send('Server error');
});

// Jeigu užklausa neatitinka jokio aukščiau aprašyto maršruto, gaunamas 404 klaidos puslapis
// čia 'app.get('*error', ...)' reiškia "visi GET užklausų keliai, kurie atitinka '*error' pattern"
// Galbūt tavo projekte tai būdas parodyti puslapį su 404 klaida
app.get('*error', (req, res) => {
    return res.send(new PageError404(req).render());
});

// Paleidžiame serverį nurodytu PORT, ir kai jis pradeda klausyti,
// išvedame konsolėje adresą, kur galima pasiekti programą
app.listen(PORT, () => {
    console.log(`WEB URL: http://localhost:${PORT}`);
});