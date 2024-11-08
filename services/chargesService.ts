import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin actuel du fichier
const __filename = fileURLToPath(import.meta.url);

// Obtenir le répertoire actuel
const __dirname = path.dirname(__filename);
// Définir le chemin vers le fichier charges.json
const chargesFilePath = path.resolve(__dirname, '../../charges.json');

// Fonction pour lire les charges depuis le fichier JSON
export function readCharges() {
    const data = fs.readFileSync(chargesFilePath, 'utf8');
    return JSON.parse(data);
}

// Fonction pour écrire les charges dans le fichier JSON
function writeCharges(charges: object) {
    fs.writeFileSync(chargesFilePath, JSON.stringify(charges, null, 2), 'utf8');
}
// Fonction auxiliaire pour accéder à un chemin de propriété dynamique
function setNestedProperty(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}; // Créé des objets s'ils n'existent pas encore
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
}

// Fonction auxiliaire pour obtenir une propriété imbriquée
function getNestedProperty(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

// Fonction auxiliaire pour supprimer une propriété imbriquée
function deleteNestedProperty(obj: any, path: string) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) return; // Si le chemin n'existe pas, on arrête
        current = current[keys[i]];
    }

    delete current[keys[keys.length - 1]];
}

// Ajouter ou créer une charge
export function addCharge(path: string, chargeData: any) {
    const charges = readCharges();
    setNestedProperty(charges, path, chargeData);
    writeCharges(charges);
    return charges;
}

// Modifier une charge existante
export function updateCharge(path: string, chargeData: any) {
    const charges = readCharges();
    const existingCharge = getNestedProperty(charges, path);

    if (existingCharge !== undefined) {
        setNestedProperty(charges, path, chargeData);
        writeCharges(charges);
        return charges;
    } else {
        throw new Error(`Charge not found at path: ${path}`);
    }
}

// Supprimer une charge existante
export function deleteCharge(path: string) {
    const charges = readCharges();
    const existingCharge = getNestedProperty(charges, path);

    if (existingCharge !== undefined) {
        deleteNestedProperty(charges, path);
        writeCharges(charges);
        return charges;
    } else {
        throw new Error(`Charge not found at path: ${path}`);
    }
}