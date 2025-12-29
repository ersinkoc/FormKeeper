import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Layout } from '@/components/layout/Layout'
import { DocsLayout } from '@/components/layout/DocsLayout'

// Pages
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { DocsIndex } from '@/pages/docs/index'
import { Installation } from '@/pages/docs/Installation'
import { QuickStart } from '@/pages/docs/QuickStart'
import { CreateFormApi } from '@/pages/docs/api/CreateForm'
import { ApiIndex } from '@/pages/docs/api/index'
import { Examples } from '@/pages/examples/index'
import { LoginFormExample } from '@/pages/examples/LoginForm'
import { RegistrationExample } from '@/pages/examples/Registration'
import { DynamicFieldsExample } from '@/pages/examples/DynamicFields'
import { MultiStepWizardExample } from '@/pages/examples/MultiStepWizard'
import { AsyncValidationExample } from '@/pages/examples/AsyncValidation'
import { SchemaValidationExample } from '@/pages/examples/SchemaValidation'
import { AutosaveExample } from '@/pages/examples/Autosave'
import { NestedObjectsExample } from '@/pages/examples/NestedObjects'
import { Playground } from '@/pages/playground/index'

// Concepts
import { Validation } from '@/pages/docs/concepts/Validation'
import { ArrayFields } from '@/pages/docs/concepts/ArrayFields'
import FieldRegistration from '@/pages/docs/concepts/FieldRegistration'
import FormState from '@/pages/docs/concepts/FormState'
import NestedFields from '@/pages/docs/concepts/NestedFields'
import ErrorHandling from '@/pages/docs/concepts/ErrorHandling'
import FormCreation from '@/pages/docs/concepts/FormCreation'

// API
import UseForm from '@/pages/docs/api/UseForm'
import UseField from '@/pages/docs/api/UseField'
import UseFieldArray from '@/pages/docs/api/UseFieldArray'
import UseWatch from '@/pages/docs/api/UseWatch'
import Controller from '@/pages/docs/api/Controller'
import ValidationRules from '@/pages/docs/api/ValidationRules'
import Types from '@/pages/docs/api/Types'

// Frameworks
import { ReactFramework } from '@/pages/docs/frameworks/React'
import { VueFramework } from '@/pages/docs/frameworks/Vue'
import { SvelteFramework } from '@/pages/docs/frameworks/Svelte'
import { VanillaFramework } from '@/pages/docs/frameworks/Vanilla'

// Plugins
import { PluginsIndex } from '@/pages/docs/plugins/index'
import { WizardPlugin } from '@/pages/docs/plugins/WizardPlugin'
import { PersistPlugin } from '@/pages/docs/plugins/PersistPlugin'
import { AutosavePlugin } from '@/pages/docs/plugins/AutosavePlugin'
import { SchemaPlugin } from '@/pages/docs/plugins/SchemaPlugin'
import { DevToolsPlugin } from '@/pages/docs/plugins/DevToolsPlugin'
import CorePlugins from '@/pages/docs/plugins/CorePlugins'
import CustomPlugins from '@/pages/docs/plugins/CustomPlugins'

// Guides
import MultiStepForms from '@/pages/docs/guides/MultiStepForms'
import DynamicForms from '@/pages/docs/guides/DynamicForms'
import AsyncValidation from '@/pages/docs/guides/AsyncValidation'
import CustomInputs from '@/pages/docs/guides/CustomInputs'
import Testing from '@/pages/docs/guides/Testing'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Documentation */}
                <Route path="/docs" element={<DocsLayout />}>
                  <Route index element={<DocsIndex />} />
                  <Route path="installation" element={<Installation />} />
                  <Route path="quick-start" element={<QuickStart />} />

                  {/* Concepts */}
                  <Route path="concepts/form-creation" element={<FormCreation />} />
                  <Route path="concepts/validation" element={<Validation />} />
                  <Route path="concepts/array-fields" element={<ArrayFields />} />
                  <Route path="concepts/field-registration" element={<FieldRegistration />} />
                  <Route path="concepts/form-state" element={<FormState />} />
                  <Route path="concepts/nested-fields" element={<NestedFields />} />
                  <Route path="concepts/error-handling" element={<ErrorHandling />} />

                  {/* API */}
                  <Route path="api" element={<ApiIndex />} />
                  <Route path="api/create-form" element={<CreateFormApi />} />
                  <Route path="api/use-form" element={<UseForm />} />
                  <Route path="api/use-field" element={<UseField />} />
                  <Route path="api/use-field-array" element={<UseFieldArray />} />
                  <Route path="api/use-watch" element={<UseWatch />} />
                  <Route path="api/controller" element={<Controller />} />
                  <Route path="api/validation-rules" element={<ValidationRules />} />
                  <Route path="api/types" element={<Types />} />

                  {/* Frameworks */}
                  <Route path="frameworks/react" element={<ReactFramework />} />
                  <Route path="frameworks/vue" element={<VueFramework />} />
                  <Route path="frameworks/svelte" element={<SvelteFramework />} />
                  <Route path="frameworks/vanilla" element={<VanillaFramework />} />

                  {/* Plugins */}
                  <Route path="plugins" element={<PluginsIndex />} />
                  <Route path="plugins/wizard" element={<WizardPlugin />} />
                  <Route path="plugins/persist" element={<PersistPlugin />} />
                  <Route path="plugins/autosave" element={<AutosavePlugin />} />
                  <Route path="plugins/schema" element={<SchemaPlugin />} />
                  <Route path="plugins/devtools" element={<DevToolsPlugin />} />
                  <Route path="plugins/core-plugins" element={<CorePlugins />} />
                  <Route path="plugins/custom-plugins" element={<CustomPlugins />} />

                  {/* Guides */}
                  <Route path="guides/multi-step-forms" element={<MultiStepForms />} />
                  <Route path="guides/dynamic-forms" element={<DynamicForms />} />
                  <Route path="guides/async-validation" element={<AsyncValidation />} />
                  <Route path="guides/custom-inputs" element={<CustomInputs />} />
                  <Route path="guides/testing" element={<Testing />} />
                </Route>

                {/* Examples */}
                <Route path="/examples" element={<Examples />} />
                <Route path="/examples/login-form" element={<LoginFormExample />} />
                <Route path="/examples/registration" element={<RegistrationExample />} />
                <Route path="/examples/dynamic-fields" element={<DynamicFieldsExample />} />
                <Route path="/examples/multi-step-wizard" element={<MultiStepWizardExample />} />
                <Route path="/examples/async-validation" element={<AsyncValidationExample />} />
                <Route path="/examples/schema-validation" element={<SchemaValidationExample />} />
                <Route path="/examples/autosave" element={<AutosaveExample />} />
                <Route path="/examples/nested-objects" element={<NestedObjectsExample />} />

                {/* Playground */}
                <Route path="/playground" element={<Playground />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
