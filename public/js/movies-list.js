const deleteButtonsDOM = document.querySelectorAll('table button'); // Paimami visi mygtukai, esantys lentelėje (gali būti "Ištrinti" mygtukai)

for (const btnDOM of deleteButtonsDOM) { // Einama per kiekvieną mygtuką atskirai
    btnDOM.addEventListener('click', () => { // Kiekvienam mygtukui priskiriamas paspaudimo įvykio klausytojas
        fetch('/api/admin/movies/' + btnDOM.dataset.url, { // Siunčiama DELETE užklausa į serverį su filmo identifikatoriumi iš `data-url`
            method: 'DELETE', // Nurodoma, kad tai DELETE tipo užklausa
        })
            .then(res => res.json()) // Kai gaunamas atsakymas iš serverio, jis paverčiamas į JSON objektą
            .then(data => { // Apdorojamas gautas JSON
                if (data.status === 'success') { // Jei serveris grąžina sėkmės statusą
                    btnDOM.closest('tr').remove(); // Pašalinama visa lentelės eilutė, kurioje yra paspaustas mygtukas
                }
            })
            .catch(console.error); // Jei įvyksta klaida – ji parodoma konsolėje
    });
}