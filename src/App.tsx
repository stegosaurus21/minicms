import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Contests from './pages/Contests';
import Login from './pages/Login';
import Register from './pages/Register';
import Contest from './pages/Contest';
import Challenge from './pages/Challenge';
import Results from './pages/Results';
import { makeBackendRequest } from './helper';
import { Breadcrumb, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './styles.module.css';

export interface TokenProp {
  token: string | null
};

export interface TokenSetterProp {
  token: [string | null, React.Dispatch<React.SetStateAction<string | null>>]
};


export const App: React.FC<{}> = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const params = useParams();

  useEffect(() => {
    localStorage.setItem('token', token || '');
  }, [token]);

  return (
    <Router>
    <Header token={[token, setToken]}/>
      <Container>
        <Breadcrumb>
        </Breadcrumb>
      </Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contests" element={<Contests token={token}/>} />
        <Route path="/contests/:contest" element={<Contest token={token}/>} />
        <Route path="/contests/:contest/:challenge" element={<Challenge token={token}/>} />
        <Route path="/contests/:contest/:challenge/:submission" element={<Results token={token}/>} />
        <Route path="/auth/login" element={<Login token={[token, setToken]}/>} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </Router>
    
  );
}