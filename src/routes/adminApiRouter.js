import express from 'express';
import { postCategories } from '../api/admin/categories/postCategories.js';
import { deleteCategories } from '../api/admin/categories/deleteCategories.js';
import { putCategories } from '../api/admin/categories/putCategories.js';
import { postMovies } from '../api/admin/movies/postMovies.js';
import { deleteMovies } from '../api/admin/movies/deleteMovies.js';
import { putMovies } from '../api/admin/movies/putMovies.js';

// Sukuriame naują Express maršrutų (router) objektą, kuris bus skirtas admin API keliams
export const adminApiRouter = express.Router();

// Užregistruojame POST maršrutą /categories - kategorijų kūrimui
// Kai į šį endpoint'ą bus siųsta POST užklausa, bus kviečiama funkcija postCategories
adminApiRouter.post('/categories', postCategories);

// Užregistruojame PUT maršrutą /categories/:original_url - kategorijų atnaujinimui pagal originalų URL
// :original_url yra kintamasis kelio segmentas, kuris bus perduodamas funkcijai putCategories
adminApiRouter.put('/categories/:original_url', putCategories);

// Užregistruojame DELETE maršrutą /categories/:url - kategorijų trynimui pagal URL
// :url yra kintamasis kelio segmentas, kuris bus perduodamas funkcijai deleteCategories
adminApiRouter.delete('/categories/:url', deleteCategories);

// Užregistruojame POST maršrutą /movies - filmų kūrimui
adminApiRouter.post('/movies', postMovies);

// Užregistruojame PUT maršrutą /movies/:original_url - filmų atnaujinimui pagal originalų URL
adminApiRouter.put('/movies/:original_url', putMovies);

// Užregistruojame DELETE maršrutą /movies/:url - filmų trynimui pagal URL
adminApiRouter.delete('/movies/:url', deleteMovies);