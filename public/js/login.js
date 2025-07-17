const formDOM = document.forms[0]; // Paimama pirmoji forma dokumente (login forma)
const usernameOrEmailDOM = document.getElementById('username_or_email'); // Paimamas naudotojo vardo arba el. pašto įvesties laukas
const passwordDOM = document.getElementById('password'); // Paimamas slaptažodžio įvesties laukas

if (formDOM) { // Patikrinama, ar forma egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Pridedamas formos submit įvykio klausytojas
        e.preventDefault(); // Sustabdomas numatytas naršyklės elgesys (puslapio perkrovimas)

        const data = { // Kuriamas objektas su prisijungimo duomenimis
            usernameOrEmail: usernameOrEmailDOM.value, // Įrašo naudotojo vardą arba el. paštą
            password: passwordDOM.value, // Įrašo slaptažodį
        };

        fetch('/api/login', { // Siunčiama POST užklausa į serverį prisijungimui
            method: 'POST', // Nurodoma, kad tai POST metodas, kuris naudojamas duomenu issiuntimui. gavimui 
            headers: {
                'Content-Type': 'application/json', // Nurodo, kad siunčiamas JSON turinys
            },
            body: JSON.stringify(data), // Duomenų objektas paverčiamas į JSON tekstą
        })
            .then(res => res.json()) // Serverio atsakymas paverčiamas į JSON objektą
            .then(data => { // Kai gaunamas atsakymas, tikrinamas jo turinys
                if (data.status === 'success' && data.action === 'redirect') { // Jei prisijungimas pavyko ir reikia peradresuoti
                    location.href = data.href; // Naršyklė peradresuojama į nurodytą puslapį
                }
            })
            .catch(console.error); // Klaidos atveju klaida išvedama į naršyklės konsolę
    });
}