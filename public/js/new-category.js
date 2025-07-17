const formDOM = document.forms[0]; // Paimama pirmoji forma dokumente (kategorijos kūrimo forma)
const titleDOM = document.getElementById('title'); // Paimamas antraštės (pavadinimo) įvesties laukas
const urlDOM = document.getElementById('url'); // Paimamas URL įvesties laukas
const descriptionDOM = document.getElementById('description'); // Paimamas aprašymo įvesties laukas
const statusPublishedDOM = document.getElementById('status_published'); // Paimamas checkbox‘as „Published“
const statusDraftDOM = document.getElementById('status_draft'); // Paimamas checkbox‘as „Draft“

if (formDOM) { // Tikrinama, ar forma egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Pridedamas submit įvykio klausytojas formai
        e.preventDefault(); // Sustabdomas numatytasis formos pateikimo elgesys (perkrovimas)

        const data = { // Sukuriamas objektas su pradine formai reikalinga informacija
            title: titleDOM.value, // Įrašomas pavadinimas iš įvesties lauko
            url: urlDOM.value, // Įrašomas URL iš įvesties lauko
            status: 'draft', // Nustatoma pradinė būsena kaip „draft“
        };

        if (descriptionDOM.value) { // Jei yra įrašytas aprašymas
            data.description = descriptionDOM.value; // Įtraukiamas aprašymas į duomenų objektą
        }

        if (statusPublishedDOM.checked) { // Jei pažymėta būsena „Published“
            data.status = 'published'; // Būsena nustatoma kaip „published“
        }

        fetch('/api/admin/categories', { // Siunčiama POST užklausa į serverį (naujos kategorijos sukūrimui)
            method: 'POST', // Naudojamas POST metodas
            headers: {
                'Content-Type': 'application/json', // Nurodoma, kad duomenys siunčiami JSON formatu
            },
            body: JSON.stringify(data), // Objektas paverčiamas į JSON tekstą ir pridedamas prie užklausos kūno
        })
            .then(res => res.json()) // Gauta serverio užklausa paverčiama į JSON
            .then(data => { // Toliau dirbama su gautu JSON objektu
                if (data.status === 'success' && data.action === 'redirect') { // Jei viskas pavyko ir serveris nurodo peradresuoti
                    location.href = data.href; // Naršyklė peradresuojama į nurodytą puslapį
                }
            })
            .catch(console.error); // Jei įvyksta klaida – ji išvedama į konsolę
    });
}