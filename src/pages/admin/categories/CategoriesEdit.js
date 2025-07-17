import { getCategoryByUrlSlug } from "../../../db/admin/getCategoryByUrlSlug.js";
import { AdminTemplate } from "../../../templates/AdminTemplate.js";

// Ši klasė paveldi AdminTemplate klasę, kuri yra bazinis administracinio puslapio šablonas
export class PageAdminCategoriesEdit extends AdminTemplate {
    // Konstruktorius, kuris gauna Express užklausos objektą `req`
    constructor(req) {
        // Iškviečiame bazinės klasės konstruktorių su `req`
        super(req);
        // Nustatome, kad šiam puslapiui priskirtas JavaScript modulis ar failas 'edit-category'
        this.pageJS = 'edit-category';
    }

    // Asinchroninis metodas, kuris sugeneruoja pagrindinį puslapio turinį
    async main() {
        // Gauname kategorijos duomenis pagal URL identifikatorių (slug),
        // kurį gauna iš užklausos parametruose (req.params.urlSlug)
        const data = await getCategoryByUrlSlug(this.req.params.urlSlug);
        // Imame pirmą rezultatą (tikimės, kad bus tik viena kategorija)
        const category = data[0];

        // Jei kategorija nerasta (pvz., neteisingas slug arba kategorija ištrinta)
        if (!category) {
            // Grąžiname paprastą pranešimą, kad kategorija nerasta
            return `
            <main>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h1 class="display-5">Category not found</h1>
                        </div>
                    </div>
                </div>
            </main>`;
        }

        // Jeigu kategorija rasta, sugeneruojame HTML formą, kuri leidžia redaguoti kategorijos duomenis
        // Formoje yra laukai pavadinimui, url_slug, aprašymui ir statusui
        return `
            <main>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h1 class="display-5">Edit category</h1>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <form class="col-12 col-md-9 col-lg-6">
                            <!-- Pasleptas input su originaliu url slug, kad žinotume, ką redaguojame -->
                            <input value="${category.url_slug}" type="text" id="original_url" hidden>

                            <!-- Pavadinimo laukas -->
                            <div class="mb-3">
                                <label for="title" class="form-label">Title</label>
                                <input value="${category.title}" type="text" class="form-control" id="title" required>
                            </div>

                            <!-- URL slug laukas -->
                            <div class="mb-3">
                                <label for="url" class="form-label">Url slug</label>
                                <input value="${category.url_slug}" type="text" class="form-control" id="url" required>
                            </div>

                            <!-- Aprašymo laukas -->
                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea class="form-control" id="description">${category.description}</textarea>
                            </div>

                            <!-- Statuso pasirinkimo radijo mygtukai -->
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <div class="form-check">
                                    <input ${category.statusName === 'published' ? 'checked' : ''} type="radio" name="radios" class="form-check-input" id="status_published" required>
                                    <label class="form-check-label" for="status_published">Published</label>
                                </div>
                                <div class="form-check">
                                    <input ${category.statusName === 'draft' ? 'checked' : ''} type="radio" name="radios" class="form-check-input" id="status_draft" required>
                                    <label class="form-check-label" for="status_draft">Draft</label>
                                </div>
                            </div>

                            <!-- Mygtukai formos pateikimui ir atstatymui -->
                            <button type="submit" class="btn btn-primary">Update</button>
                            <button type="reset" class="btn btn-secondary float-end">Reset</button>
                        </form>
                    </div>
                </div>
            </main>`;
    }
}