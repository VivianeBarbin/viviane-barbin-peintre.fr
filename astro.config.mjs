// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [sanity({
        projectId: 'x31r8s87',
        dataset: 'local_dev',
        useCdn: false,
        studioBasePath: '/admin',
        apiVersion: "2026-01-13"
        
      }), react()]
});
