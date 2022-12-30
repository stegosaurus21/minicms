import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { TokenSetterProp } from "src/App";
import { makeBackendRequest, onLoggedIn } from "src/helper";
import style from '../styles.module.css';

const Header = (props: TokenSetterProp) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  
  const [token, setToken] = props.token;

  const logout = async () => {
    await makeBackendRequest('POST', '/auth/logout', token);
  }

  onLoggedIn(token, (username: string) => setUsername(username));
  
  return (
    <Navbar sticky="top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand as="span" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>MiniCMS</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as="span" style={{cursor: 'pointer'}} onClick={() => navigate('/contests')}>Contests</Nav.Link>
          <Nav.Link as="span" style={{cursor: 'pointer'}} onClick={() => (username === '') ? navigate('/auth/login') : logout().then(() => {
            setUsername('');
            setToken('');
            navigate("/");
          })}>{(username === '') ? "Login / Register" : "Logout"}</Nav.Link>
        </Nav>
        {username !== '' && <Navbar.Text className="justify-content-end">Signed in as <span className={style.bold}>{username}</span></Navbar.Text>}
      </Container>
    </Navbar>
  )
};

export default Header;