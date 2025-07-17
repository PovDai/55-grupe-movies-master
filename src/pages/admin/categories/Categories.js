import { getAllCategories } from "../../../db/admin/getAllCategories.js";
import { AdminTemplate } from "../../../templates/AdminTemplate.js";
import { tableCategories } from "../../../ui/tables/tableCategories.js";

// Klasė PageAdminCategories paveldi AdminTemplate (kuri greičiausiai yra bendro admin puslapio šablonas)
export class PageAdminCategories extends AdminTemplate {
    // Konstruktorius gauna užklausos objektą (req)
    constructor(req) {
        // Kviečiam tėvinį konstruktorių (AdminTemplate)
        super(req);
        // Nustatome, koks JavaScript failas bus įkeltas šiam puslapiui (pvz., 'category-list.js')
        this.pageJS = 'category-list';
    }

    // Asinchroninė pagrindinė metodas, kuris grąžina HTML turinį puslapiui
    async main() {
        // Gauname visų kategorijų duomenis iš duomenų bazės arba kito šaltinio
        const data = await getAllCategories();

        // Grąžiname HTML šabloną kaip stringą
        // Šablone naudojame duomenis, kad sugeneruotume lentelę su kategorijomis
        return `
            <main>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h1 class="display-5">All categories</h1>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            ${tableCategories(data)}  <!-- Įterpiame lentelę su kategorijų duomenimis -->
                        </div>
                    </div>
                </div>
            </main>`;
    }
}