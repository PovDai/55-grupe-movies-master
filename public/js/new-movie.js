const formDOM = document.forms[0]; // Paimama pirmoji forma dokumente (naujo filmo kūrimo forma)
const titleDOM = document.getElementById('title'); // Paimamas pavadinimo įvesties laukas
const urlDOM = document.getElementById('url'); // Paimamas URL įvesties laukas
const descriptionDOM = document.getElementById('description'); // Paimamas aprašymo įvesties laukas
const durationHoursDOM = document.getElementById('duration_hours'); // Paimamas valandų įvesties laukas trukmei
const durationMinutesDOM = document.getElementById('duration_minutes'); // Paimamas minučių įvesties laukas trukmei
const categoryDOM = document.getElementById('category'); // Paimamas kategorijos pasirinkimo laukas
const releaseDateDOM = document.getElementById('release_date'); // Paimamas išleidimo datos laukas
const ratingDOM = document.getElementById('rating'); // Paimamas įvertinimo laukas
const statusPublishedDOM = document.getElementById('status_published'); // Paimamas checkbox „Published“
const statusDraftDOM = document.getElementById('status_draft'); // Paimamas checkbox „Draft“

if (formDOM) { // Jei forma egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Priskiriamas submit įvykio klausytojas
        e.preventDefault(); // Sustabdomas numatytasis formos pateikimo elgesys (puslapio perkrovimas)

        const data = { // Kuriamas objektas su pradiniais duomenimis
            title: titleDOM.value, // Įrašomas filmo pavadinimas
            url: urlDOM.value, // Įrašomas filmo URL
            category: +categoryDOM.value, // Kategorijos ID konvertuojamas į skaičių ir įrašomas
            status: '', // Pradinė būsena paliekama tuščia (bus nustatyta vėliau)
        };

        if (descriptionDOM.value) { // Jei yra aprašymas
            data.description = descriptionDOM.value; // Pridedamas aprašymas prie duomenų objekto
        }

        if (durationHoursDOM.value || durationMinutesDOM.value) { // Jei įrašyta bent viena trukmės dalis
            let h = 0; // Inicializuojamos valandos
            if (Number.isInteger(+durationHoursDOM.value)) { // Jei valandos yra sveikas skaičius
                h = +durationHoursDOM.value; // Priskiriamos valandos
            }

            let min = 0; // Inicializuojamos minutės
            if (Number.isInteger(+durationMinutesDOM.value)) { // Jei minutės yra sveikas skaičius
                min = +durationMinutesDOM.value; // Priskiriamos minutės
            }

            data.duration = h * 60 + min; // Skaičiuojama bendra trukmė minutėmis
        }

        if (releaseDateDOM.value) { // Jei nurodyta išleidimo data
            data.releaseDate = releaseDateDOM.value; // Pridedama prie duomenų objekto
        }

        if (ratingDOM.value) { // Jei nurodytas įvertinimas
            data.rating = +ratingDOM.value; // Konvertuojamas į skaičių ir pridedamas
        }

        if (statusPublishedDOM.checked) { // Jei pažymėtas „Published“
            data.status = 'published'; // Nustatoma būsena „published“
        }
        if (statusDraftDOM.checked) { // Jei pažymėtas „Draft“
            data.status = 'draft'; // Nustatoma būsena „draft“
        }

        fetch('/api/admin/movies', { // Siunčiama POST užklausa į serverį (naujo filmo kūrimui)
            method: 'POST', // Naudojamas POST metodas
            headers: {
                'Content-Type': 'application/json', // Nurodoma, kad siunčiami duomenys JSON formatu
            },
            body: JSON.stringify(data), // Duomenų objektas paverčiamas į JSON tekstą
        })
            .then(res => res.json()) // Serverio atsakymas paverčiamas į JSON objektą
            .then(data => { // Apdorojamas gautas atsakymas
                console.log(data); // Atsakymas išvedamas į konsolę (diagnostikai)
            })
            .catch(console.error); // Jei įvyksta klaida – ji išvedama į konsolę
    })
}