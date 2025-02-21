import React, { useState } from 'react';

interface ContactFormProps {}

export const ContactForm: React.FC<ContactFormProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email }); // Logique de soumission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Champ Nom */}
      <div className="transition-opacity duration-300 opacity-100">
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-base-content/80 dark:text-white/80">
          Votre nom
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Champ Email */}
      <div className="transition-opacity duration-300 opacity-100">
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-base-content/80 dark:text-white/80">
          Votre email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Bouton de Soumission */}
      <button type="submit" className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
        Envoyer
      </button>
    </form>
  );
};
