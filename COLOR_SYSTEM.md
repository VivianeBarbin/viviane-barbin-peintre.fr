# Color System Architecture

Complete documentation for the centralized, type-safe color system.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         src/config.ts                           │
│                   (Single Source of Truth)                      │
│                                                                 │
│  export const themeConfig: ThemeConfig = {                     │
│    colors: {                                                    │
│      light: { primary: '0.70 0.15 260', ... },                 │
│      dark: { primary: '0.45 0.18 255', ... }                   │
│    }                                                            │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (1) Run script
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              scripts/generate-css-vars.ts                       │
│                  (Build-time Generator)                         │
│                                                                 │
│  Reads config → Generates CSS variables                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (2) Generates
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         src/styles/global/variables.css                         │
│              (Auto-generated - DO NOT EDIT)                     │
│                                                                 │
│  :root {                                                        │
│    --color-primary: 0.70 0.15 260;                             │
│  }                                                              │
│  .dark {                                                        │
│    --color-primary: 0.45 0.18 255;                             │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (3) Imported via
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/styles/global/index.css → src/styles/index.css            │
│                           ↓                                     │
│                  src/layouts/Layout.astro                       │
│                  (Global CSS Entry Point)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (4) Referenced by
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     uno.config.ts                               │
│                   (UnoCSS Theme Config)                         │
│                                                                 │
│  theme: {                                                       │
│    colors: {                                                    │
│      primary: 'oklch(var(--color-primary))'                    │
│    }                                                            │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (5) Generates utilities
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Your Components                              │
│                                                                 │
│  <div class="bg-primary text-primary-foreground">              │
│  <button class="bg-accent hover:bg-accent/90">                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 File Structure

```
viviane-barbin-peintre.fr/
├── src/
│   ├── config.ts                        # ✅ EDIT THIS
│   ├── types/index.d.ts                 # Type definitions
│   ├── styles/
│   │   ├── index.css                    # Main CSS entry
│   │   └── global/
│   │       ├── index.css                # Global imports
│   │       └── variables.css            # ⚠️ AUTO-GENERATED
│   └── layouts/
│       └── Layout.astro                 # Imports global CSS
├── scripts/
│   ├── generate-css-vars.ts             # Build script
│   └── README.md                        # Script documentation
├── uno.config.ts                        # UnoCSS configuration
└── package.json                         # Scripts: generate:vars, prebuild
```

## 🎨 Color Tokens

### Brand Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `primary` | Brown/Orange | Bright Purple | Primary actions, headers |
| `primaryForeground` | Off-white | Deep Purple | Text on primary backgrounds |
| `secondary` | Purple | Orange | Secondary actions |
| `secondaryForeground` | Off-white | Deep Orange | Text on secondary backgrounds |
| `accent` | Purple | Bright Purple | Highlights, badges |
| `accentForeground` | Off-white | Deep Purple | Text on accent backgrounds |

### Content/Surface Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `background` | Off-white | Deep Purple | Page background |
| `foreground` | Dark Brown | Light Gray | Main text color |
| `card` | White | Darker Purple | Card backgrounds |
| `cardForeground` | Dark Brown | Light Gray | Text on cards |
| `muted` | Light Gray | Mid Purple | Subtle backgrounds |
| `mutedForeground` | Medium Brown | Mid-Light Purple | Secondary text |
| `border` | Light Gray | Border Purple | Borders, dividers |

## 🔧 How to Use

### 1. Edit Colors (TypeScript)

**File:** `src/config.ts`

```typescript
export const themeConfig: ThemeConfig = {
  colors: {
    mode: 'auto', // 'light' | 'dark' | 'auto'
    light: {
      primary: '0.2489 0.0697 36.95',    // ← Edit here
      primaryForeground: '0.9896 0.0186 96.86',
      // ... other colors
    },
    dark: {
      primary: '0.7 0.15 260',           // ← Edit here
      primaryForeground: '0.15 0.01 260',
      // ... other colors
    }
  }
}
```

### 2. Generate CSS Variables

```bash
# Manually generate
pnpm run generate:vars

# Automatically on build
pnpm run build  # (calls prebuild hook)
```

### 3. Use in Components

#### UnoCSS Utilities (Recommended)
```astro
<div class="bg-primary text-primary-foreground">
  <h1 class="text-2xl">Hello World</h1>
</div>

<button class="bg-accent hover:bg-accent/90 text-accent-foreground">
  Click me
</button>

<div class="border border-border bg-card text-card-foreground">
  Card content
</div>
```

#### Direct CSS Variables
```astro
<style>
  .custom-element {
    background: oklch(var(--color-muted));
    color: oklch(var(--color-muted-foreground));
    border: 1px solid oklch(var(--color-border));
  }
</style>
```

#### JavaScript/TypeScript Access
```typescript
import { themeConfig } from '@/config';

// Get current theme mode
const mode = themeConfig.colors.mode;

// Access color values programmatically
const lightPrimary = themeConfig.colors.light.primary;
const darkPrimary = themeConfig.colors.dark.primary;
```

## 🌗 Dark Mode

Dark mode is controlled by adding the `.dark` class to the `<html>` element.

### Manual Toggle Example

```astro
---
// src/components/ThemeToggle.astro
---
<button id="theme-toggle">Toggle Theme</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  toggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', 
      html.classList.contains('dark') ? 'dark' : 'light'
    );
  });
  
  // Restore theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  }
</script>
```

### Auto Mode (System Preference)

```astro
<script is:inline>
  // Run before page renders to prevent flash
  if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

## 🎨 OKLCH Color Format

All colors use the OKLCH format for perceptual uniformity and wider color gamut.

### Format: `Lightness Chroma Hue`

```
0.70 0.15 260
│    │    └── Hue: 0-360 (color angle)
│    └─────── Chroma: 0-0.4 (saturation)
└──────────── Lightness: 0-1 (brightness)
```

### Examples

```css
/* Purple: 70% brightness, 0.15 saturation, 260° hue */
--color-primary: 0.70 0.15 260;

/* Orange: 65% brightness, 0.12 saturation, 40° hue */
--color-secondary: 0.65 0.12 40;

/* Gray: 50% brightness, 0.04 saturation (low = desaturated) */
--color-muted-foreground: 0.50 0.04 36.95;
```

### Tools
- [OKLCH Color Picker](https://oklch.com/)
- [OKLCH vs sRGB Comparison](https://oklch.com/#70,0.15,260,100)

### Browser Support
OKLCH is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 15.4+).

For older browsers, consider adding fallbacks:
```css
:root {
  --color-primary: #6b5bff; /* Fallback */
  --color-primary: 0.70 0.15 260; /* OKLCH */
}
```

## 🔄 Workflow Examples

### Scenario 1: Change Primary Color

1. **Edit** `src/config.ts`:
   ```ts
   light: {
     primary: '0.60 0.20 280',  // Changed to blue
   }
   ```

2. **Generate**:
   ```bash
   pnpm run generate:vars
   ```

3. **Done!** All `bg-primary`, `text-primary`, etc. now use the new color.

### Scenario 2: Add New Color Token

1. **Update type** in `src/types/index.d.ts`:
   ```ts
   light: {
     // ... existing colors
     success: string;
     successForeground: string;
   }
   ```

2. **Add to config** in `src/config.ts`:
   ```ts
   light: {
     // ... existing colors
     success: '0.65 0.15 145',
     successForeground: '0.98 0.01 145',
   }
   ```

3. **Update script** `scripts/generate-css-vars.ts`:
   ```ts
   generateColorVars({
     // ... existing colors
     success: light.success,
     successForeground: light.successForeground,
   })
   ```

4. **Add to UnoCSS** `uno.config.ts`:
   ```ts
   colors: {
     // ... existing colors
     success: 'oklch(var(--color-success))',
     successForeground: 'oklch(var(--color-success-foreground))',
   }
   ```

5. **Generate & Use**:
   ```bash
   pnpm run generate:vars
   ```
   ```astro
   <div class="bg-success text-success-foreground">Success!</div>
   ```

## ✅ Benefits

- ✅ **Single source of truth** - Edit colors in one place
- ✅ **Type-safe** - TypeScript validates your color values
- ✅ **Auto-sync** - Script keeps CSS and config in perfect sync
- ✅ **No manual work** - Generate CSS with one command
- ✅ **Build integration** - Auto-generates before production builds
- ✅ **Perceptual uniformity** - OKLCH ensures consistent brightness
- ✅ **Wide gamut** - Access colors outside sRGB
- ✅ **Dark mode built-in** - Just toggle `.dark` class

## ⚠️ Important Rules

1. **NEVER manually edit** `src/styles/global/variables.css`
2. **ALWAYS edit colors in** `src/config.ts`
3. **ALWAYS run** `pnpm run generate:vars` after editing
4. **COMMIT** both `config.ts` and `variables.css` together

## 🐛 Troubleshooting

### Colors not updating?
```bash
# Regenerate CSS variables
pnpm run generate:vars

# Clear cache and restart dev server
rm -rf .astro node_modules/.vite
pnpm run dev
```

### TypeScript errors?
```bash
# Check config matches types
npx tsc --noEmit src/config.ts
```

### Dark mode not working?
- Ensure `.dark` class is on `<html>` element
- Check browser devtools: `document.documentElement.classList`
- Verify `variables.css` has `.dark { ... }` definitions

## 📚 Resources

- [UnoCSS Theming](https://unocss.dev/config/theme)
- [OKLCH Color Space](https://oklch.com/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Astro Styling](https://docs.astro.build/en/guides/styling/)