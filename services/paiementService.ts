import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin actuel du fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le chemin vers le fichier paiement.json
const paiementFilePath = path.resolve(__dirname, '../../paiement.json');

// Fonction pour lire les paiements depuis le fichier JSON
export function readPaiements() {
    const data = fs.readFileSync(paiementFilePath, 'utf8');
    return JSON.parse(data);
}

// Fonction pour écrire les paiements dans le fichier JSON
function writePaiements(paiements: object) {
    fs.writeFileSync(paiementFilePath, JSON.stringify(paiements, null, 2), 'utf8');
}

// Fonction auxiliaire pour accéder à un chemin de propriété dynamique
function setNestedProperty(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}; // Crée des objets s'ils n'existent pas encore
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

// Ajouter ou créer un paiement
export function addPaiement(path: string, paiementData: any) {
    const paiements = readPaiements();
    setNestedProperty(paiements, path, paiementData);
    writePaiements(paiements);
    return paiements;
}

// Modifier un paiement existant
export function updatePaiement(path: string, paiementData: any) {
    const paiements = readPaiements();
    const existingPaiement = getNestedProperty(paiements, path);

    if (existingPaiement !== undefined) {
        setNestedProperty(paiements, path, paiementData);
        writePaiements(paiements);
        return paiements;
    } else {
        throw new Error(`Paiement not found at path: ${path}`);
    }
}

// Supprimer un paiement existant
export function deletePaiement(path: string) {
    const paiements = readPaiements();
    const existingPaiement = getNestedProperty(paiements, path);

    if (existingPaiement !== undefined) {
        deleteNestedProperty(paiements, path);
        writePaiements(paiements);
        return paiements;
    } else {
        throw new Error(`Paiement not found at path: ${path}`);
    }
}
