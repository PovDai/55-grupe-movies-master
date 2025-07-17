const formDOM = document.forms[0]; // Paimama pirmoji forma iš dokumento
const originalUrlDOM = document.getElementById('original_url'); // Paimamas laukelis, kuriame saugoma originali URL reikšmė (naudojama kaip ID)
const titleDOM = document.getElementById('title'); // Paimamas antraštės (title) įvesties laukas
const urlDOM = document.getElementById('url'); // Paimamas URL įvesties laukas
const descriptionDOM = document.getElementById('description'); // Paimamas aprašymo laukas
const durationHoursDOM = document.getElementById('duration_hours'); // Paimamas trukmės valandų įvesties laukas
const durationMinutesDOM = document.getElementById('duration_minutes'); // Paimamas trukmės minučių įvesties laukas
const categoryDOM = document.getElementById('category'); // Paimamas kategorijos pasirinkimo laukas
const releaseDateDOM = document.getElementById('release_date'); // Paimamas išleidimo datos laukas
const ratingDOM = document.getElementById('rating'); // Paimamas įvertinimo laukas
const statusPublishedDOM = document.getElementById('status_published'); // Paimamas checkbox‘as „Published“
const statusDraftDOM = document.getElementById('status_draft'); // Paimamas checkbox‘as „Draft“

if (formDOM) { // Jei forma egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Priskiriamas submit įvykio klausytojas
        e.preventDefault(); // Sustabdomas numatytas formos pateikimo veiksmas (puslapio perkrovimas)

        const data = { // Kuriamas objektas duomenims, kurie bus siunčiami į serverį
            title: titleDOM.value, // Įrašomas filmo pavadinimas
            url: urlDOM.value, // Įrašomas URL
            category: +categoryDOM.value, // Kategorijos ID paverčiamas į skaičių ir įrašomas
            status: '', // Pradinė būsena (bus nustatyta vėliau)
        };

        if (descriptionDOM.value) { // Jei įrašytas aprašymas
            data.description = descriptionDOM.value; // Pridedamas aprašymas prie duomenų objekto
        }

        if (durationHoursDOM.value || durationMinutesDOM.value) { // Jei įrašyta bent viena trukmės dalis
            let h = 0; // Inicializuojamos valandos
            if (Number.isInteger(+durationHoursDOM.value)) { // Patikrinama ar valandų reikšmė yra sveikasis skaičius
                h = +durationHoursDOM.value; // Priskiriama reikšmė
            }

            let min = 0; // Inicializuojamos minutės
            if (Number.isInteger(+durationMinutesDOM.value)) { // Patikrinama ar minučių reikšmė yra sveikasis skaičius
                min = +durationMinutesDOM.value; // Priskiriama reikšmė
            }

            data.duration = h * 60 + min; // Apskaičiuojama bendra trukmė minutėmis
        }

        if (releaseDateDOM.value) { // Jei nurodyta išleidimo data
            data.releaseDate = releaseDateDOM.value; // Įtraukiama į duomenų objektą
        }

        if (ratingDOM.value) { // Jei nurodytas įvertinimas
            data.rating = +ratingDOM.value; // Įvertinimas paverčiamas į skaičių ir įrašomas
        }

        if (statusPublishedDOM.checked) { // Jei pažymėta būsena „Published“
            data.status = 'published'; // Nustatoma būsena „published“
        }
        if (statusDraftDOM.checked) { // Jei pažymėta būsena „Draft“
            data.status = 'draft'; // Nustatoma būsena „draft“
        }

        fetch('/api/admin/movies/' + originalUrlDOM.value, { // Siunčiama PUT užklausa į serverį su originaliu URL (filmo ID)
            method: 'PUT', // Naudojamas PUT metodas (atnaujinimui)
            headers: {
                'Content-Type': 'application/json', // Nurodoma, kad siunčiama JSON forma
            },
            body: JSON.stringify(data), // Duomenų objektas paverčiamas į JSON tekstą
        })
            .then(res => res.json()) // Serverio atsakymas paverčiamas į JSON objektą
            .then(data => { // Toliau dirbama su gautu JSON
                if (data.status === 'success' && data.action === 'redirect') { // Jei viskas pavyko ir reikia peradresuoti
                    location.href = data.href; // Naršyklė peradresuojama į nurodytą URL
                }
            })
            .catch(console.error); // Klaidos atveju ji išvedama į konsolę
    })
}