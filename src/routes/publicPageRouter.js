import express from 'express';
import { PageHome } from '../pages/public/Home.js';
import { PageMovies } from '../pages/public/Movies.js';
import { PageCategories } from '../pages/public/Categories.js';
import { PageLogin } from '../pages/public/Login.js';
import { PageRegister } from '../pages/public/Register.js';

export const publicPageRouter = express.Router();

// Nustatomas GET maršrutas pagrindiniam puslapiui ('/')
// Kai atkeliauja GET užklausa į '/', sukuriamas naujas PageHome objektas su req,
// vykdoma jo render funkcija (asinkroninė), kurios rezultatas siunčiamas kaip atsakymas
publicPageRouter.get('/', async (req, res) => 
    res.send(await new PageHome(req).render())
);

// GET maršrutas filmo puslapiui ('/movies')
// Sukuriamas PageMovies objektas, paleidžiama render funkcija ir siunčiama HTML atsakyme
publicPageRouter.get('/movies', async (req, res) => 
    res.send(await new PageMovies(req).render())
);

// GET maršrutas kategorijų puslapiui ('/categories')
// Sukuriamas PageCategories objektas, vykdoma jo render funkcija ir siunčiama rezultatas
publicPageRouter.get('/categories', async (req, res) => 
    res.send(await new PageCategories(req).render())
);

// GET maršrutas prisijungimo puslapiui ('/login')
// Sukuriamas PageLogin objektas, vykdoma jo render funkcija ir siunčiamas puslapis
publicPageRouter.get('/login', async (req, res) => 
    res.send(await new PageLogin(req).render())
);

// GET maršrutas registracijos puslapiui ('/register')
// Sukuriamas PageRegister objektas, paleidžiama render funkcija ir rezultatas išsiunčiamas klientui
publicPageRouter.get('/register', async (req, res) => 
    res.send(await new PageRegister(req).render())
);