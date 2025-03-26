import { I18nextProvider } from 'react-i18next'
import './App.css'
import i18n from './locale'
import AppRouter from './routers'
import { Toaster } from './components/ui/toaster'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './lib/provider/authProvider'
import { SidebarProvider } from './lib/provider/sidebarProvider'

function App() {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <AppRouter />
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  )
}

export default App
