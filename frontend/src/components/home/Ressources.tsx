import React from 'react';

const ressourcesList = [
  { 
    titre: 'FAQ', 
    href: '/faq',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Consultez nos questions fréquentes'
  },
  { 
    titre: 'Documentation', 
    href: '/docs',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    description: 'Accédez à notre documentation technique'
  },
  { 
    titre: 'Guides', 
    href: '/guides',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    description: 'Découvrez nos guides pratiques'
  },
  { 
    titre: 'Assistance', 
    href: '/assistance',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    description: 'Obtenez de l\'aide personnalisée'
  },
];

const Ressources = () => {
  return (
    <ul className="menu bg-base-100 w-full p-0 gap-2">
      {ressourcesList.map(({ titre, href, icon, description }) => (
        <li key={titre}>
          <a 
            href={href}
            className="flex flex-col items-start p-4 gap-2 hover:bg-base-200"
          >
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
              <span className="font-medium">{titre}</span>
            </div>
            <p className="text-sm opacity-70 pl-10">{description}</p>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Ressources;