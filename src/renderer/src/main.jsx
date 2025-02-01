import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Routes, Route, HashRouter } from 'react-router'
import UpdatePartner from './UpdatePartner.jsx'
import CreatePartner from './CreatePartner.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <React.StrictMode>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/update' element={<UpdatePartner/>}/>
        <Route path='/create' element={<CreatePartner/>}/>
      </Routes>
    </React.StrictMode>
  </HashRouter>
 
)
