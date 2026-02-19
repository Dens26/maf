// import mysql from 'mysql2/promise';
// import { randomUUID } from 'crypto';
// import fs from 'fs';
// import path from 'path';

// // Crée un pool de connexion MySQL pour gérer plusieurs requêtes simultanées
// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     port: Number(process.env.MYSQL_PORT) || 3306,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Type des données nécessaires pour créer une formalité (tous obligatoires)
// type createFormality = {
//     typeFormaliteId: number;
//     name: string;
//     email: string;
//     phone: string;
//     city: string;
//     zipcode: string;
//     pdf: {
//         filename: string;
//         base64: string;
//     };
// };

// /**
//  * Crée une nouvelle formalité dans la base de données.
//  * 
//  * - Génère un `demandeId` unique pour cette formalité
//  * - Sauvegarde le PDF dans /public/pdfs
//  * - Insère la demande dans la table `demandes` avec les statuts initiaux :
//  *      statutPaiement = en_attente (id=1)
//  *      statutFormalite = en_attente (id=1)
//  * 
//  * @param param0 Les informations complètes de la formalité
//  * @returns le `demandeId` généré pour référence et paiement
//  */
// export async function createFormality({ typeFormaliteId, name, email, phone, city, zipcode, pdf }: createFormality) {
//   try {
//     const demandeId = randomUUID();

//     const dir = path.join(process.cwd(), 'public', 'pdfs');
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

//     const pdfPath = path.join('pdfs', `${demandeId}_${pdf.filename}`);
//     fs.writeFileSync(
//       path.join(process.cwd(), 'public', pdfPath),
//       Buffer.from(pdf.base64, 'base64')
//     );
// console.log("INSERT DATA :", {
//   demandeId,
//   email,
//   name,
//   typeFormaliteId,
//   pdfPath,
//   phone,
//   city,
//   zipcode
// });
//     await pool.execute(
//       `INSERT INTO demandes 
//        (demandeId, email, name, typeFormaliteId, statutPaiementId, statutFormaliteId, pdf, phone, city, zipcode) 
//        VALUES (?, ?, ?, ?, 1, 1, ?, ?, ?, ?)`,
//       [demandeId, email, name, typeFormaliteId, pdfPath, phone, city, zipcode]
//     );

//   } catch (err) {
//     console.error("ERREUR CREATE FORMALITY :", err);
//     throw err; // important pour remonter l'erreur
//   }
// }

// /**
//  * Récupère une formalité en base de données via son `demandeId`.
//  * Joint les tables `statut_paiement`, `statut_formalite` et `type_formalite` pour obtenir les libellés.
//  * 
//  * @param demandeId L'identifiant unique de la formalité
//  * @returns Les informations de la formalité ou null si non trouvée
//  */
// export async function getFormality(demandeId: string) {
//     const [rows] = await pool.execute(
//         `SELECT d.*, 
//                 tp.nom AS statutPaiement, 
//                 sf.nom AS statutFormalite, 
//                 tf.nom AS typeFormalite
//          FROM demandes d
//          JOIN statut_paiement tp ON d.statutPaiementId = tp.id
//          JOIN statut_formalite sf ON d.statutFormaliteId = sf.id
//          JOIN type_formalite tf ON d.typeFormaliteId = tf.id
//          WHERE d.demandeId = ?`,
//         [demandeId]
//     );

//     return (rows as any[])[0] || null; // Retourne la première ligne ou null
// }

// /**
//  * Met à jour le statut de paiement d'une formalité
//  * 
//  * @param demandeId L'identifiant unique de la formalité
//  * @param statutPaiementId L'ID du nouveau statut de paiement (ex: 1=en_attente, 2=payé)
//  */
// export async function updateStatutPaiement(demandeId: string, statutPaiementId: number) {
//     await pool.execute(
//         `UPDATE demandes SET statutPaiementId = ? WHERE demandeId = ?`,
//         [statutPaiementId, demandeId]
//     );
// }

// /**
//  * Met à jour le statut de la formalité
//  * 
//  * @param demandeId L'identifiant unique de la formalité
//  * @param statutFormaliteId L'ID du nouveau statut de formalité (ex: 1=en_attente, 2=en_traitement)
//  */
// export async function updateStatutFormalite(demandeId: string, statutFormaliteId: number) {
//     await pool.execute(
//         `UPDATE demandes SET statutFormaliteId = ? WHERE demandeId = ?`,
//         [statutFormaliteId, demandeId]
//     );
// }

// export default pool;