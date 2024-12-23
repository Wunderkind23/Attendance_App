import React from 'react'
import LoginPage from "./pages/Login";
import MainPage1 from "./pages/MainPage1";
import {Routes, Route} from 'react-router-dom';
import Branches from './pages/Branches';
import Branch from './pages/Branch';
import ProtectedRoute from './component/ProtectedRoute';




function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route element={<ProtectedRoute/>}>
            <Route path="/main" element={<MainPage1/>}/>
            <Route path='/branches' element={<Branches/>} />
            <Route path='/branch' element={<Branch/>} />
        </Route>

        
        



      </Routes>
    </div>
  );
}

export default App;
