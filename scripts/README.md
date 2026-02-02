# Scripts

This directory contains build and utility scripts for the project.

## generate-css-vars.ts

Automatically generates `src/styles/global/variables.css` from the typed configuration in `src/config.ts`.

### Why?

This script ensures that your CSS variables always stay in sync with your TypeScript configuration, providing:

- **Single source of truth**: Edit colors only in `src/config.ts`
- **Type safety**: TypeScript validates your color values
- **No manual sync**: Never forget to update CSS when changing config
- **Consistency**: Guaranteed match between config and styles

### Usage

```bash
# Using pnpm (recommended)
pnpm run generate:vars

# Using npm
npm run generate:vars

# Using yarn
yarn generate:vars
```

### Workflow

1. **Edit colors** in `src/config.ts`:

   ```ts
   colors: {
     light: {
       primary: '0.70 0.15 260',  // ← Change this
       // ...
     }
   }
   ```

2. **Run the script**:

   ```bash
   pnpm run generate:vars
   ```

3. **Done!** The CSS variables in `src/styles/global/variables.css` are now updated.

### What it generates

The script generates a complete CSS file with:

- All light mode color variables (`:root`)
- All dark mode color variables (`.dark`)
- Organized sections (Brand colors, Content/Surfaces)
- Auto-generated warning header

### Important Notes

⚠️ **DO NOT manually edit `variables.css`** - it will be overwritten!  
✅ **Always edit colors in `src/config.ts`** instead

### Integration with Build

You can optionally add this to your build process:

```json
{
  "scripts": {
    "prebuild": "pnpm run generate:vars",
    "build": "astro build"
  }
}
```

This ensures CSS variables are always up-to-date before building.

### OKLCH Color Format

Colors use the OKLCH format (Lightness Chroma Hue):

- **Lightness**: 0-1 (0 = black, 1 = white)
- **Chroma**: 0-0.4 (saturation/vividness)
- **Hue**: 0-360 (color angle)

Example: `0.70 0.15 260` = Purple with 70% lightness, 0.15 chroma, 260° hue

Learn more: https://oklch.com
