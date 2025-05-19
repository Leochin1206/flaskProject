import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/navbar.jsx'
import App from './App.jsx'
import { Footer } from './components/footer.jsx'
import "./App.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col sm:flex-row">
        <div className=" sm:!pt-0 flex-grow">
          <main className="min-h-screen">
            <App />
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>
)