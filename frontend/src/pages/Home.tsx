import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { config } from '../config';
import style from '../styles.module.css';

const Home: React.FC<{}> = () => {
  const [times, setTimes] = useState(0);

  return (
    <>
      <Container className="justify-content-center text-center">
        <p>Welcome to MiniCMS!</p>
      </Container>
    </>
  )
};

export default Home;
