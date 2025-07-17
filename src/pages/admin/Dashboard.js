import { COOKIE_MAX_AGE } from "../../env.js";
import { AdminTemplate } from "../../templates/AdminTemplate.js";

export class PageDashboard extends AdminTemplate {
    // Pagrindinis metodas, kuris sugeneruoja ir grąžina HTML turinį puslapiui
    main() {
        // Paimame laiką, kada buvo sukurtas prisijungimo tokenas (Date objektas),
        // konvertuojame į milisekundes nuo UNIX epoch (1970-01-01)
        const cookie = this.req.user.login_token_created_at.getTime();

        // Apskaičiuojame likusį sesijos laiką sekundėmis:
        // COOKIE_MAX_AGE yra maksimalus sesijos laiko ilgis sekundėmis
        // Iš jos atimame jau praėjusį laiką nuo prisijungimo tokeno sukūrimo iki dabar
        // (Date.now() - cookie) duoda praėjusį laiką milisekundėmis, todėl dalinam iš 1000, kad gautume sekundes
        const secondsLeft = Math.floor(COOKIE_MAX_AGE - (Date.now() - cookie) / 1000);

        // Apskaičiuojame sekundžių dalį (likusias sekundes nepilnai minutes)
        const seconds = secondsLeft % 60;

        // Apskaičiuojame likusias minutes
        const minutes = (secondsLeft - seconds) / 60;

        // Grąžiname HTML šabloną kaip stringą, kuriame rodomas pasveikinimas, vartotojo vardas,
        // el. paštas ir likęs sesijos laikas minutes:sekundes formatu
        return `
            <main>
               <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h1 class="display-1">Welcome to your dashboard!</h1>
                            <p class="display-6">Username: ${this.req.user.username}</p>
                            <p class="display-6">Email: ${this.req.user.email}</p>
                            <p class="display-6">Likęs sesijos laikas: ${minutes}:${seconds}</p>
                        </div>
                    </div>
                </div>
            </main>`;
    }
}