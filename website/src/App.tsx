import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HomePage } from '@/pages/home'
import { DocsPage } from '@/pages/docs'
import { ApiPage } from '@/pages/api'
import { ExamplesPage } from '@/pages/examples'
import { PlaygroundPage } from '@/pages/playground'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="formkeeper-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/docs/*" element={<DocsPage />} />
              <Route path="/api/*" element={<ApiPage />} />
              <Route path="/examples/*" element={<ExamplesPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
