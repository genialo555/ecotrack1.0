// scripts/create-admin.ts

import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { validate } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

// Charger les variables d'environnement depuis .env
dotenv.config();

class AdminCredentials {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;
}

// Récupérer les variables d'environnement nécessaires
const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME
} = process.env;

// Vérifier que toutes les variables nécessaires sont définies
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_FIRST_NAME',
  'ADMIN_LAST_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

function sanitizeInput(input: string): string {
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });
}

// Fonction principale pour créer un admin
async function createAdmin() {
  const adminCredentials = new AdminCredentials();
  adminCredentials.email = sanitizeInput(ADMIN_EMAIL.toLowerCase());
  adminCredentials.password = ADMIN_PASSWORD;
  adminCredentials.first_name = sanitizeInput(ADMIN_FIRST_NAME);
  adminCredentials.last_name = sanitizeInput(ADMIN_LAST_NAME);

  // Valider les données d'admin
  const errors = await validate(adminCredentials);
  if (errors.length > 0) {
    console.error('Invalid admin credentials:', errors);
    process.exit(1);
  }

  try {
    // Générer le hash bcrypt pour le mot de passe avec un coût élevé
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);

    // Créer un client PostgreSQL avec SSL si en production
    const client = new Client({
      host: DATABASE_HOST,
      port: parseInt(DATABASE_PORT, 10),
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Se connecter à la base de données
    await client.connect();
    console.log('Connected to database.');

    // Utiliser une transaction pour garantir l'atomicité
    await client.query('BEGIN');

    try {
      // Vérifier si un utilisateur avec le même email existe déjà
      const checkUserQuery = 'SELECT id FROM users WHERE email = $1';
      const checkUserResult = await client.query(checkUserQuery, [
        adminCredentials.email,
      ]);

      if (checkUserResult.rows.length > 0) {
        throw new Error(`A user with email ${adminCredentials.email} already exists.`);
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
          updated_at,
          last_login,
          failed_login_attempts
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW(), NOW(), NULL, 0
        ) RETURNING id;
      `;

      const insertValues = [
        adminCredentials.email,
        hashedPassword,
        'ADMIN',
        true,
        adminCredentials.first_name,
        adminCredentials.last_name,
      ];

      const insertResult = await client.query(insertQuery, insertValues);
      const newUserId = insertResult.rows[0].id;

      await client.query('COMMIT');
      console.log(`Administrator created successfully! ID: ${newUserId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Fermer la connexion dans tous les cas
      await client.end();
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error creating administrator:', error.message);
    process.exit(1);
  }
}

// Exécuter la fonction
createAdmin();
