const originalUrlDOM = document.getElementById('original_url'); // Paimamas input elementas, kuriame saugoma pradinė URL reikšmė (naudojama atnaujinant)
const urlDOM = document.getElementById('url'); // Paimamas URL įvesties laukas
const descriptionDOM = document.getElementById('description'); // Paimamas aprašymo įvesties laukas
const statusPublishedDOM = document.getElementById('status_published'); // Paimamas checkbox'as "Published"
const statusDraftDOM = document.getElementById('status_draft'); // Paimamas checkbox'as "Draft"

if (formDOM) { // Tikrina, ar formos elementas egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Prideda formos pateikimo (submit) įvykio klausytoją
        e.preventDefault(); // Sustabdo numatytą naršyklės elgesį (formos persikrovimą)

        const data = { // Sukuria objektą su pradine informacija
            title: titleDOM.value, // Įrašo antraštę (title) iš formos lauko
            url: urlDOM.value, // Įrašo URL reikšmę iš formos
            status: 'draft', // Nustato pradinį statusą kaip „draft“ (juodraštis)
        };

        if (descriptionDOM.value) { // Jei įvestas aprašymas
            data.description = descriptionDOM.value; // Prideda aprašymą į duomenų objektą
        }

        if (statusPublishedDOM.checked) { // Jei pažymėta „published“ būsena
            data.status = 'published'; // Pakeičia statusą į „published“
        }

        fetch('/api/admin/categories/' + originalUrlDOM.value, { // Siunčia PUT užklausą į serverį su originaliu URL
            method: 'PUT', // Naudoja PUT metodą – skirtą atnaujinimui
            headers: {
                'Content-Type': 'application/json', // Nurodo, kad siunčiamas JSON turinys
            },
            body: JSON.stringify(data), // Objektą paverčia į JSON tekstą ir prideda prie užklausos
        })
            .then(res => res.json()) // Paverčia serverio atsakymą į JSON
            .then(data => { // Kai JSON paruoštas, tikrina atsakymą
                if (data.status === 'success' && data.action === 'redirect') { // Jei viskas pavyko ir nurodoma, kad reikia peradresuoti
                    location.href = data.href; // Naršyklė peradresuojama į naują adresą
                }
            })
            .catch(console.error); // Jei įvyksta klaida – ji išvedama į naršyklės konsolę
    });
}