import express from 'express';
import { postRegister } from '../api/public/postRegister.js';
import { postLogin } from '../api/public/postLogin.js';

// Sukuriame naują Express router'į, skirtą viešajam (public) API
export const publicApiRouter = express.Router();

// Užregistruojame POST maršrutą /register - vartotojo registracijai
// Kai atkeliauja POST užklausa į /register, kviečiama funkcija postRegister
publicApiRouter.post('/register', postRegister);

// Užregistruojame POST maršrutą /login - vartotojo prisijungimui (login)
// Kai atkeliauja POST užklausa į /login, kviečiama funkcija postLogin
publicApiRouter.post('/login', postLogin);