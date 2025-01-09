'use client';

import React, { useState } from 'react';
import { Button } from '../common/Button';

interface NewsletterFormProps {
  className?: string;
  getAnimationClass: (delay?: number) => string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ className = '', getAnimationClass }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSubscribing(false);
    setEmail('');
  };

  if (success) {
    return (
      <div className={`bg-emerald-200/20 p-[68px] rounded-[42px] text-center ${getAnimationClass()}`}>
        <svg className="w-[84px] h-[84px] text-emerald-500 mx-auto mb-[42px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-5xl font-bold mb-[26px] bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_100%]">Inscription réussie!</h3>
        <p className="text-xl text-emerald-600 dark:text-emerald-400">Vous recevrez bientôt nos actualités.</p>
        <Button variant="ghost" className="mt-[42px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-300 bg-emerald-50/10 dark:bg-emerald-900/10 hover:bg-emerald-50/20 dark:hover:bg-emerald-900/20" onClick={() => setSuccess(false)}>
          S'inscrire avec une autre adresse
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-[68px] ${className}`}>
      <div>
        <label htmlFor="newsletterEmail" className="block text-xl font-medium mb-[26px] bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
          Votre adresse email
        </label>
        <input
          type="email"
          id="newsletterEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-[42px] py-[26px] rounded-[42px] bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 text-xl text-emerald-700 dark:text-emerald-300 placeholder-emerald-400"
          required
        />
      </div>
      <div className="flex justify-center">
        <Button type="submit" variant="secondary" className="relative overflow-hidden group rounded-[42px] px-[68px] py-[26px] bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500" disabled={isSubscribing}>
          {isSubscribing ? (
            <span className="flex items-center text-xl text-emerald-50">
              <svg className="animate-spin -ml-[26px] mr-[26px] h-[42px] w-[42px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription...
            </span>
          ) : (
            <>
              <span className="relative z-10 text-xl font-medium text-emerald-50">S'abonner</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
