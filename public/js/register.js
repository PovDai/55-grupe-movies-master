const formDOM = document.forms[0]; // Paimama pirmoji forma dokumente (registracijos forma)
const usernameDOM = document.getElementById('username'); // Paimamas naudotojo vardo įvesties laukas
const emailDOM = document.getElementById('email'); // Paimamas el. pašto įvesties laukas
const passwordDOM = document.getElementById('password'); // Paimamas slaptažodžio įvesties laukas
const tosDOM = document.getElementById('tos'); // Paimamas „terms of service“ (taisyklių) sutikimo laukas

if (formDOM) { // Jei forma egzistuoja DOM'e
    formDOM.addEventListener('submit', (e) => { // Pridedamas submit įvykio klausytojas formai
        e.preventDefault(); // Sustabdomas numatytasis formos pateikimo elgesys (puslapio perkrovimas)

        const data = { // Sukuriamas objektas su registracijos duomenimis
            username: usernameDOM.value, // Įrašomas naudotojo vardas
            email: emailDOM.value, // Įrašomas el. paštas
            password: passwordDOM.value, // Įrašomas slaptažodis
            tos: tosDOM.value, // Įrašoma taisyklių sutikimo reikšmė
        };

        fetch('/api/register', { // Siunčiama POST užklausa į serverio registracijos endpointą
            method: 'POST', // Nurodomas POST metodas
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
    });
}