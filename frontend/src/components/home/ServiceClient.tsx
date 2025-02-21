import React from 'react';

const ServiceClient = () => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base opacity-80">
        Notre équipe de service client dédiée est là pour vous aider avec toutes vos questions ou préoccupations.
      </p>
      
      <div className="flex flex-col gap-4">
        <a 
          href="tel:+33123456789" 
          className="btn btn-outline btn-primary w-full justify-start gap-2"
        >
          {/* Phone Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          +33 (0)1 23 45 67 89
        </a>

        <a 
          href="mailto:support@exemple.fr" 
          className="btn btn-outline btn-primary w-full justify-start gap-2"
        >
          {/* Mail Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          support@exemple.fr
        </a>
      </div>
    </div>
  );
};

export default ServiceClient;