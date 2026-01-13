import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'viviane-barbin-peintre-studio',

  projectId: 'x31r8s87',
  dataset: 'local_dev',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
