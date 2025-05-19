import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/navbar'

import { Login } from './pages/login'
import { Cadastro } from './pages/cadastro'

import { Configuracoes } from './pages/configuracoes'
import { Home } from './pages/home'
import { Metas } from './pages/metas'
import { Orcamentos } from './pages/orcamentos'
import { Relatorios } from './pages/relatorios'
import { Transacoes } from './pages/transacoes'

import './App.css'

export default function App() {
  const location = useLocation()
  const hideNavbarRoutes = ["/", "/cadastro"]
  const hideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />

        <Route path='/configuracoes' element={<Configuracoes />} />
        <Route path='/home' element={<Home />} />
        <Route path='/metas' element={<Metas />} />
        <Route path='/orcamentos' element={<Orcamentos />} />
        <Route path='/relatorios' element={<Relatorios />} />
        <Route path='/transacoes' element={<Transacoes />} />
      </Routes>
    </>
  )
}