// Importuojame 'dotenv' biblioteką, kuri leidžia įkelti aplinkos kintamuosius iš .env failų
import dotenv from 'dotenv';

// Gauname visus argumentus, perduotus per komandų eilutę, praleidžiant pirmuosius du (node ir skripto pavadinimą)
const argList = process.argv.slice(2); 
/*[ process.argv slepiasi sis mazdaug masyvas 
  '/usr/local/bin/node',     // 0: Node.js kelias
  '/home/user/index.js',     // 1: Tavo skripto kelias
  '--env=dev',               // 2: argumentas nr. 1
  '--port=1234'              // 3: argumentas nr. 2
]*/

// Sukuriame tuščią objektą, kuriame saugosime argumentus kaip raktas:reikšmė
const args = {};

// Pereiname per visus argumentus iš komandų eilutės
for (const str of argList) {
    // Kiekvieną argumentą skaidome per '=' ženklą, kad atskirtume raktą ir reikšmę
    const [key, value] = str.split('=');

    // Tikriname, ar raktas ir reikšmė egzistuoja ir ar raktas prasideda '--' (pvz. '--env=dev')
    if (key && value && key.startsWith('--')) {
        // Jei taip, pašaliname pirmuosius du simbolius '--' iš rakto ir išsaugome reikšmę args objekte
        // Pvz. '--env=dev' => args['env'] = 'dev'
        args[key.slice(2)] = value;
        /*Tada:

argList bus: ['--env=dev']

key = '--env'

value = 'dev'

key.slice(2) → 'env'

Todėl args.env = 'dev'*/
    }
}

// Naudodami dotenv, įkeliame aplinkos kintamuosius iš .env failo, kurio pavadinimas priklauso nuo 'env' argumento
// Pvz. jei komandų eilutėje buvo --env=dev, tai bus ieškoma 'src/.env.dev' failo
dotenv.config({
    path: 'src/.env.' + args.env,
    quiet: true,  // tyliai, be klaidų jei failo nėra
});

// Dabar eksportuojame reikalingus aplinkos kintamuosius, jei jie nepateikti – naudojame numatytąsias reikšmes
export const NODE_ENV = process.env.NODE_ENV ?? 'dev'; // aplinkos režimas (pvz., 'dev' arba 'production')
export const PORT = +process.env.PORT ?? 5519;        // serverio portas (konvertuojame į skaičių)
export const TITLE = process.env.TITLE ?? 'Project title'; // projekto pavadinimas

// Duomenų bazės prisijungimo nustatymai:
export const DB_HOST = process.env.DB_HOST ?? 'localhost';   // DB serverio adresas
export const DB_PORT = +process.env.DB_PORT ?? 3306;          // DB serverio portas
export const DB_DATABASE = process.env.DB_DATABASE ?? 'test_db'; // DB pavadinimas
export const DB_USER = process.env.DB_USER ?? 'test_user';    // DB vartotojo vardas
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'test_password'; // DB slaptažodis

// Slapuko galiojimo laikas sekundėmis (konvertuojame į skaičių)
export const COOKIE_MAX_AGE = +process.env.COOKIE_MAX_AGE ?? 3600;