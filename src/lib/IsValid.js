export class IsValid {
    // Statinis metodas 'fields' - tikrina pateiktus duomenis pagal privalomą ir papildomą schemą
    // data - objektas su tikrinamais duomenimis
    // requiredSchema - objektas, kuriame nurodyti privalomi laukai ir jų tikrinimo funkcijų pavadinimai
    // optionalSchema - objektas, kuriame nurodyti papildomi laukai ir jų tikrinimo funkcijų pavadinimai (pagal nutylėjimą tuščias)
    static fields(data, requiredSchema, optionalSchema = {}) {
        // Objektas, į kurį kaupsime klaidas
        const errors = {};

        // Sukuriame masyvą su visais galimais raktais - privalomais ir papildomais
        // Object.keys() grąžina masyvą iš objekto raktų
        const possibleKeys = Object.keys(requiredSchema).concat(Object.keys(optionalSchema));

        // Pirmiausia patikriname, ar data objekte nėra rakto, kurio nėra mūsų schemose
        // Jeigu yra toks raktas, kurio nėra nei privalomų, nei papildomų laukų, gražiname klaidą iškart
        for (const key in data) {
            // Jei raktas nėra mūsų galimų raktų sąraše
            if (!possibleKeys.includes(key)) {
                // Grąžiname klaidą (true reiškia klaidą) su žinute, kad pateiktas neteisingas raktas
                return [true, 'Ka tu cia dirbi?... Pateikei rakta kuris nera nei tarp privalomu, nei tarp papildomu galimu saraso... 👀👀👀'];
            }
        }

        // Toliau tikriname visus privalomus laukus pagal nurodytas funkcijas
        for (const key in requiredSchema) {
            // Iš requiredSchema paimame funkcijos pavadinimą, pvz. 'nonEmptyString' ar 'email'
            const funcName = requiredSchema[key];

            // Gauname patikrinimo funkciją iš pačios IsValid klasės (statinės funkcijos)
            const func = IsValid[funcName];

            // Iš duomenų pasiimame vertę pagal raktą
            const value = data[key];

            // Kviesime funkciją, kuri grąžina klaidų bool ir žinutę [err, msg]
            const [err, msg] = func(value);

            // Jeigu klaida, pridedame ją į errors objektą po atitinkamu raktu
            if (err) {
                errors[key] = msg;
            }
        }

        // Toliau tikriname papildomus laukus - bet jei vertė undefined arba tuščia, praleidžiame (neprivaloma)
        for (const key in optionalSchema) {
            const funcName = optionalSchema[key];
            const func = IsValid[funcName];
            const value = data[key];

            // Jei reikšmė nėra pateikta, tęsiame toliau (praleidžiame patikrinimą)
            if (!value) {
                continue;
            }

            // Atlikt funkcijos patikrinimą
            const [err, msg] = func(value);

            // Jei klaida, pridedame ją prie errors
            if (err) {
                errors[key] = msg;
            }
        }

        // Galiausiai grąžiname rezultatą:
        // - pirmas argumentas: ar klaidų yra (true jei yra, false jei nėra)
        // - antras argumentas: pats klaidų objektas (tuščias, jei klaidų nėra)
        return [Object.keys(errors).length > 0, errors];
    }


    static username(text) {
        const minSize = 3;
        const maxSize = 20;
        const allowedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        if (typeof text !== 'string') {
            return [true, 'Slapyvardis turi buti tekstas'];
        }

        if (text.length < minSize) {
            return [true, `Slapyvardis turi buti ne maziau ${minSize} simboliu`];
        }

        if (text.length > maxSize) {
            return [true, `Slapyvardis turi buti ne daugiau ${maxSize} simboliu`];
        }

        if (text.includes(' ')) {
            return [true, 'Slapyvardis negali tureti tarpu'];
        }

        const foundIllegalSymbols = [];

        for (const s of text) {
            if (!allowedSymbols.includes(s) && !foundIllegalSymbols.includes(s)) {
                foundIllegalSymbols.push(s);
            }
        }

        if (foundIllegalSymbols.length) {
            return [true, `Slapyvardyje panaudotas neleistinas simbolis: ${foundIllegalSymbols.join(', ')}`];
        }

        return [false, ''];
    }

    static password(text) {
        const minSize = 12;
        const maxSize = 100;

        if (typeof text !== 'string') {
            return [true, 'Slaptazodis turi buti tekstas'];
        }

        if (text.length < minSize) {
            return [true, `Slaptazodis turi tureti ne maziau ${minSize} simboliu`];
        }

        if (text.length > maxSize) {
            return [true, `Slaptazodis turi tureti ne daugiau ${maxSize} simboliu`];
        }

        return [false, ''];
    }

    static age(number) {
        const min = 18;
        const max = 130;

        if (typeof number !== 'number' || !Number.isInteger(number) || number < 0) {
            return [true, 'Amzius turi buti teigiamas sveikasis skaicius'];
        }

        if (number < min) {
            return [true, `Amzius turi tureti ne mazesnis nei ${min} metu`];
        }

        if (number > max) {
            return [true, `Amzius turi tureti ne didesnis nei ${max} metu`];
        }

        return [false, ''];
    }

    static email(text) {
        return [false, ''];
    }

    static nonEmptyString(text) {
        if (typeof text !== 'string') {
            return [true, 'Turi buti tekstas'];
        }

        if (text.length === 0) {
            return [true, 'Tekstas turi buti ne tuscias'];
        }

        return [false, ''];
    }

    static tos(text) {
        if (typeof text !== 'string') {
            return [true, 'Sutikimas su taisyklemis turi buti teksto tipo.'];
        }

        if (text !== 'agree') {
            return [true, 'Sutikimas turi buti naudojant zodi "agree".'];
        }

        return [false, ''];
    }

    static numberInteger(n) {
        if (!Number.isInteger(n)) {
            return [true, 'Turi buti sveikasis skaicius'];
        }

        if (n < 0) {
            return [true, 'Turi buti teigiamas sveikasis skaicius'];
        }

        return [false, ''];
    }

    static numberFloat(n) {
        if (!isFinite(n)) {
            return [true, 'Turi buti skaicius'];
        }

        if (n < 0) {
            return [true, 'Turi buti teigiamas skaicius'];
        }

        return [false, ''];
    }
}