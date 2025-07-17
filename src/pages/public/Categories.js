import { getAllPublicCategories } from "../../db/public/getAllCategories.js";
import { PageTemplate } from "../../templates/PageTemplate.js";
import { categoriesListSection } from "../../ui/categoriesList.js";
import { pageTitle } from "../../ui/pageTitle.js";

// Klasė PageCategories paveldi bazinę PageTemplate klasę
export class PageCategories extends PageTemplate {
    // Konstruktorius, priima užklausos objektą (request) ir perduoda jį į tėvinę klasę
    constructor(req) {
        super(req);
    }

    // Async funkcija, kuri sugeneruoja puslapio turinį
    async main() {
        // Laukiame (await) visų viešų kategorijų iškvietimo funkcijos
        const data = await getAllPublicCategories();

        // Grąžiname HTML šabloną kaip stringą
        // Šiame šablone naudojame funkciją pageTitle, kuri generuoja puslapio antraštę
        // ir categoriesListSection, kuri sukuria kategorijų sąrašo sekciją
        return `
            <main>
                ${pageTitle('Categories')}
                ${categoriesListSection(data)}
            </main>`;
    }
}