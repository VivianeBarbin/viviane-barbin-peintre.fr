import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from '../schemaTypes'
import {singletonDocumentActions, singletonSchemaTypes} from './src/sanity/singletons'
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'viviane-barbin-peintre-studio',

  projectId: 'x31r8s87',
  dataset: 'local_dev',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonSchemaTypes.has(template.schemaType)),
  },

  document: {
    actions: (prev, context) => singletonDocumentActions(prev, context),
  },
})
