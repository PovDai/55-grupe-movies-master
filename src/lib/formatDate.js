// Eksportuojame funkciją, kad galėtume ją naudoti kituose failuose
export function formatDate(date) {
    // Jei data nėra pateikta arba yra neteisinga (null, undefined ir pan.),
    // grąžiname tuščią tekstą, kad nebūtų klaidų vėliau
    if (!date) {
        return '';
    }

    // Ištraukiame metus iš Date objekto, pvz. 2025
    const y = date.getFullYear();

    // Ištraukiame mėnesį iš Date objekto
    // getMonth() grąžina reikšmes nuo 0 (sausis) iki 11 (gruodis)
    // Todėl pridedame 1, kad gautume įprastą mėnesio numerį (1-12)
    const m = date.getMonth() + 1;

    // Ištraukiame dieną iš Date objekto (1-31)
    const d = date.getDate();

    // Sudedame viską į tekstinį formatą "YYYY-MM-DD"
    // Prie mėnesio ir dienos pridedame nulį prieš skaičių, jei jis mažesnis nei 10,
    // kad būtų dviženklis (pvz., '03' vietoj '3')
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}