const deleteButtonsDOM = document.querySelectorAll('table button'); // Paima visus mygtukus, esančius lentelėje

for (const btnDOM of deleteButtonsDOM) { // Pereina per kiekvieną rastą mygtuką
    btnDOM.addEventListener('click', () => { // Prideda paspaudimo įvykio klausytoją kiekvienam mygtukui
        fetch('/api/admin/categories/' + btnDOM.dataset.url, { // Siunčia DELETE užklausą į serverį, naudojant mygtuko `data-url` reikšmę
            method: 'DELETE', // Nurodo, kad užklausos metodas yra DELETE (ištrynimas)
        })
            .then(res => res.json()) // Paverčia serverio atsakymą į JSON objektą
            .then(data => { // Kai JSON gautas, atliekami tolimesni veiksmai
                if (data.status === 'success') { // Tikrina ar serverio atsakymas rodo sėkmingą ištrynimą
                    btnDOM.closest('tr').remove(); // Pašalina mygtuko tėvinę lentelės eilutę (<tr>) iš DOM
                }
            })
            .catch(console.error); // Jei įvyksta klaida – ji išvedama į konsolę
    });
}