// Importuojame 'mysql2/promise' biblioteką, kuri leidžia dirbti su MySQL naudojant Promise API
// Tai patogiau nei tradiciniai callback'ai, nes galima naudoti async/await sintaksę
import mysql from 'mysql2/promise';

// Importuojame konfigūraciją iš 'env.js' (duomenų bazės prisijungimo duomenys)
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './env.js';

// Sukuriame ir eksportuojame duomenų bazės prisijungimą (connection)
// Naudojame await, nes mysql.createConnection grąžina Promise
export const connection = await mysql.createConnection({
    // MySQL serverio adresas (paprastai 'localhost' arba IP adresas)
    host: DB_HOST,
    // MySQL serverio prievadas (pagal nutylėjimą dažnai 3306)
    port: DB_PORT,
    // Duomenų bazės pavadinimas, prie kurios jungiamės
    database: DB_DATABASE,
    // Vartotojo vardas prisijungimui prie duomenų bazės
    user: DB_USER,
    // Slaptažodis prisijungimui prie duomenų bazės
    password: DB_PASSWORD,
});