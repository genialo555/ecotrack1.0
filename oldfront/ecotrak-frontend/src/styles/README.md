## CSS Structure

Our CSS is organized in the following hierarchy:

```
styles/
├── base/                  # Base styles, variables, and utilities
│   ├── reset.css         # CSS reset and base styles
│   ├── variables.css     # CSS variables and theming
│   └── utilities.css     # Utility classes
├── components/           # Component-specific styles
│   ├── common/          # Common UI components (buttons, inputs, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── journey/         # Journey-related components
│   └── charts/          # Chart components and visualizations
├── layouts/             # Layout-specific styles
│   ├── grid.css        # Grid system
│   ├── sidebar.css     # Sidebar styles
│   └── header.css      # Header styles
└── main.css            # Main stylesheet that imports all others
```

### Guidelines

1. **Component Styles**
   - Keep component styles close to their components
   - Use BEM naming convention for clarity
   - Avoid deep nesting (max 3 levels)

2. **Variables**
   - Use CSS variables for theming and repeated values
   - Keep all global variables in variables.css
   - Component-specific variables should be in component files

3. **Utilities**
   - Use Tailwind utilities when possible
   - Custom utilities should be minimal and well-documented

4. **Media Queries**
   - Use mobile-first approach
   - Keep breakpoints consistent with Tailwind config
