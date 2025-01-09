# Coding Guidelines - EcoTrak Frontend

## 🎯 Primary Rule: Configuration First

The most important rule: **ALWAYS prioritize global configuration over component-level styles**

## 🎨 Styling Hierarchy

1. **PostCSS Configuration (HIGHEST PRIORITY)**
   ```javascript
   // postcss.config.mjs
   /** @type {import('postcss-load-config').Config} */
   const config = {
     plugins: {
       'tailwindcss/nesting': {},  // Enable CSS nesting
       tailwindcss: {},            // Process Tailwind classes
       autoprefixer: {},           // Add vendor prefixes
     },
   };
   ```

2. **Tailwind Config**
   ```typescript
   // tailwind.config.ts
   const config = {
     theme: {
       extend: {
         colors: {
           primary: 'hsl(var(--color-primary))',
           // Other theme colors
         }
       }
     }
   }
   ```

3. **Global CSS**
   ```css
   /* globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     :root {
       --color-primary: 222 47% 11%;
       /* Base theme variables */
     }
   }

   @layer components {
     /* Global component styles */
   }
   ```

4. **Component Usage (LOWEST PRIORITY)**
   ```tsx
   // Components should only use classes defined above
   <button className="bg-primary text-white">
     Click me
   </button>
   ```

## 🔧 Best Practices

1. **CSS Variables**
   ```css
   /* ✅ DO: Define in base layer */
   @layer base {
     :root {
       --color-primary: 222 47% 11%;
     }
   }

   /* ❌ DON'T: Use arbitrary values */
   .component {
     color: hsl(222 47% 11%);
   }
   ```

2. **Component Styles**
   ```css
   /* ✅ DO: Use Tailwind utilities */
   .btn {
     @apply bg-primary text-white px-4 py-2 rounded;
   }

   /* ❌ DON'T: Write raw CSS */
   .btn {
     background-color: blue;
     color: white;
     padding: 8px 16px;
     border-radius: 4px;
   }
   ```

3. **Responsive Design**
   ```css
   /* ✅ DO: Use Tailwind breakpoints */
   <div className="text-sm md:text-base lg:text-lg">

   /* ❌ DON'T: Write media queries */
   @media (min-width: 768px) {
     .text-responsive {
       font-size: 1rem;
     }
   }
   ```

## 🌳 Arborescence et Réutilisation

### Règle d'Or
**TOUJOURS analyser l'arborescence existante avant de créer de nouveaux fichiers ou composants**

1. **Analyse Préalable**
   ```
   src/
   ├── components/        # Vérifier les composants existants
   │   ├── common/       # Composants réutilisables
   │   ├── dashboard/    # Composants spécifiques au dashboard
   │   └── layout/       # Composants de mise en page
   ├── styles/           # Styles globaux uniquement
   └── lib/             # Utilitaires et fonctions
   ```

2. **Ordre de Priorité**
   1. Réutiliser un composant existant
   2. Étendre un composant existant
   3. Créer un nouveau composant (en dernier recours)

3. **Avant de Créer**
   - [ ] Rechercher des composants similaires
   - [ ] Vérifier dans `/components/common`
   - [ ] Consulter la documentation existante
   - [ ] Analyser les patterns utilisés

### ❌ À Éviter
```tsx
// ❌ NE PAS créer de nouveaux fichiers sans analyse
/components/dashboard/NewCustomButton.tsx  // Mauvais: Button existe déjà

// ❌ NE PAS dupliquer la logique
const CustomCard = () => {  // Mauvais: Card existe déjà
  return <div className="rounded-lg shadow-md">...</div>
}
```

### ✅ Bonnes Pratiques
```tsx
// ✅ Réutiliser et étendre les composants existants
import { Button } from '@/components/common/Button';

// Étendre avec des props si nécessaire
const ActionButton = ({ action, ...props }) => (
  <Button onClick={action} {...props} />
);

// Utiliser les variants existants
<Button variant="primary" size="sm" />
```

## 📝 Component Structure

```tsx
// ✅ DO: Organize styles logically
<div className={cn(
  // Layout
  "flex items-center gap-4",
  // Typography
  "text-sm font-medium",
  // Colors
  "bg-primary text-white",
  // States
  "hover:bg-primary/90",
  // Responsive
  "md:text-base"
)}>
```

## 🚫 Common Mistakes

1. **Inline Styles**
   ```tsx
   /* ❌ DON'T */
   <div style={{ backgroundColor: 'blue' }}>

   /* ✅ DO */
   <div className="bg-primary">
   ```

2. **CSS-in-JS**
   ```tsx
   /* ❌ DON'T */
   const styles = {
     container: 'custom-style'
   }

   /* ✅ DO */
   const variants = {
     primary: 'bg-primary text-white',
     secondary: 'bg-secondary text-black'
   }
   ```

3. **Direct CSS Files**
   ```css
   /* ❌ DON'T: component.css */
   .component {
     /* styles */
   }

   /* ✅ DO: Add to globals.css in appropriate layer */
   @layer components {
     .component {
       @apply /* styles */;
     }
   }
   ```

## 🔍 Code Review Checklist

1. **Configuration**
   - [ ] Using correct PostCSS plugins
   - [ ] Tailwind config is up to date
   - [ ] CSS variables in base layer

2. **Components**
   - [ ] No inline styles
   - [ ] Using Tailwind utilities
   - [ ] Proper responsive design
   - [ ] Logical style organization

3. **Performance**
   - [ ] No duplicate styles
   - [ ] No unnecessary custom CSS
   - [ ] Using proper layer directives

## 📚 Tips for Maintainability

1. **Class Organization**
   ```tsx
   // Group related classes
   const buttonClasses = cn(
     // Base
     "px-4 py-2 rounded",
     // Variants
     variant === 'primary' && "bg-primary text-white",
     variant === 'secondary' && "bg-secondary text-black",
     // States
     "hover:opacity-90",
     // Disabled state
     disabled && "opacity-50 cursor-not-allowed"
   );
   ```

2. **Reusable Patterns**
   ```tsx
   // Define common patterns in globals.css
   @layer components {
     .input-base {
       @apply px-3 py-2 border rounded;
     }
     .input-focus {
       @apply focus:ring-2 focus:ring-primary focus:outline-none;
     }
   }
   ```

Remember:
- TOUJOURS analyser l'arborescence existante
- Privilégier la réutilisation à la création
- Configuration over custom CSS
- Tailwind utilities over custom classes
- Global patterns over component-specific styles
- CSS variables over hardcoded values
