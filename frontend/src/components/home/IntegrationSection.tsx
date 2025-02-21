import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { 
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const IntegrationSection = () => {
  const integrations = [
    {
      title: 'Create tasks.',
      description: 'Schedule your personal events and todos.',
      icon: <ClipboardDocumentListIcon className="h-6 w-6 text-white" />,
      glowColor: 'from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Plan your work.',
      description: 'Visualize your workday in your planner.',
      icon: <CalendarIcon className="h-6 w-6 text-white" />,
      glowColor: 'from-green-500/20 to-green-600/20'
    },
    {
      title: 'Sync in real time.',
      description: 'Connect with your team instantly to monitor progress and track updates.',
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      glowColor: 'from-purple-500/20 to-purple-600/20'
    }
  ];

  return (
    <section className="py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            <span className="text-orange-500">Intégrations</span>{' '}
            <span className="text-emerald-400">Complètes</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Connectez vos outils préférés et optimisez votre gestion de flotte
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* First Row */}
          <div className="flex">
            <IntegrationCard
              title={integrations[0].title}
              description={integrations[0].description}
              icon={integrations[0].icon}
              glowColor={integrations[0].glowColor}
              className="rounded-l-2xl border border-white/10"
            />
            <div className="w-[30px] relative -mx-[1px] overflow-hidden">
              <div className="absolute inset-y-[20%] w-[60px] bg-black/90 rounded-[30px]" />
            </div>
            <IntegrationCard
              title={integrations[1].title}
              description={integrations[1].description}
              icon={integrations[1].icon}
              glowColor={integrations[1].glowColor}
              className="rounded-r-2xl border border-white/10"
            />
          </div>

          {/* Second Row */}
          <div className="lg:col-span-2">
            <IntegrationCard
              title={integrations[2].title}
              description={integrations[2].description}
              icon={integrations[2].icon}
              glowColor={integrations[2].glowColor}
              className="rounded-2xl border border-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
