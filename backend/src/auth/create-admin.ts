// scripts/create-admin.ts

import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

// Récupérer les variables d'environnement nécessaires
const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  JWT_SECRET,
} = process.env;

// Vérifier que toutes les variables nécessaires sont définies
if (
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_USER ||
  !DATABASE_PASSWORD ||
  !DATABASE_NAME ||
  !JWT_SECRET
) {
  console.error(
    'Erreur : Certaines variables d’environnement sont manquantes.',
  );
  process.exit(1);
}

// Fonction principale pour créer un admin
async function createAdmin() {
  // Informations du nouvel admin
  const newAdmin = {
    email: 'jeremienunez@gmail.com', // Remplace par l'email souhaité
    password: '19941234!aA', // Remplace par le mot de passe souhaité
    first_name: 'jeremie',
    last_name: 'nunez',
    role: 'ADMIN',
    is_active: true,
  };

  try {
    // Générer le hash bcrypt pour le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newAdmin.password, saltRounds);
    console.log('Mot de passe hashé:', hashedPassword);

    // Créer un client PostgreSQL
    const client = new Client({
      host: DATABASE_HOST,
      port: parseInt(DATABASE_PORT, 10),
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
    });

    // Se connecter à la base de données
    await client.connect();
    console.log('Connecté à la base de données.');

    // Vérifier si un utilisateur avec le même email existe déjà
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserResult = await client.query(checkUserQuery, [
      newAdmin.email,
    ]);

    if (checkUserResult.rows.length > 0) {
      console.error(
        `Erreur : Un utilisateur avec l'email ${newAdmin.email} existe déjà.`,
      );
      await client.end();
      process.exit(1);
    }

    // Insérer le nouvel administrateur
    const insertQuery = `
      INSERT INTO users (
        email,
        password_hash,
        role,
        is_active,
        first_name,
        last_name,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, NOW(), NOW()
      ) RETURNING id;
    `;

    const insertValues = [
      newAdmin.email,
      hashedPassword,
      newAdmin.role,
      newAdmin.is_active,
      newAdmin.first_name,
      newAdmin.last_name,
    ];

    const insertResult = await client.query(insertQuery, insertValues);
    const newUserId = insertResult.rows[0].id;

    console.log(`Administrateur créé avec succès ! ID : ${newUserId}`);

    // Fermer la connexion
    await client.end();
    console.log('Connexion à la base de données fermée.');
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
    process.exit(1);
  }
}

// Exécuter la fonction principale
createAdmin();
