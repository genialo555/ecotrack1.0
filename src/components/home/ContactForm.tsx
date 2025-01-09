'use client';

import React, { useState } from 'react';
import { Button } from '../common/Button';

interface ContactFormProps {
  className?: string;
  getAnimationClass: (delay?: number) => string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = '', getAnimationClass }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSubmitting(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  if (success) {
    return (
      <div className={`bg-success/20 p-6 rounded-xl text-center ${getAnimationClass()}`}>
        <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Message envoyé avec succès!</h3>
        <p className="text-base-content/70">Nous vous répondrons dans les plus brefs délais.</p>
        <Button variant="ghost" className="mt-4" onClick={() => setSuccess(false)}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {[
        { id: 'name', label: 'Votre nom', type: 'text', value: name, onChange: setName },
        { id: 'email', label: 'Votre email', type: 'email', value: email, onChange: setEmail },
      ].map((field, index) => (
        <div key={field.id} className={getAnimationClass(400 + index * 200)}>
          <label htmlFor={field.id} className="block text-sm font-medium mb-2 text-base-content/80 dark:text-white/80">
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.id}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-base-200/50 dark:bg-base-200/30 border border-base-300 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-base-content dark:text-white"
            required
          />
        </div>
      ))}

      <div className={getAnimationClass(800)}>
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-base-content/80 dark:text-white/80">
          Votre message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-base-200/50 dark:bg-base-200/30 border border-base-300 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none text-base-content dark:text-white"
          required
        ></textarea>
      </div>

      <div className={`flex justify-center ${getAnimationClass(1000)}`}>
        <Button type="submit" variant="primary" className="relative overflow-hidden group" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          ) : (
            <>
              <span className="relative z-10">Envoyer le message</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
