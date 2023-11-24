import React, { useState } from "react";
import { Container } from "react-bootstrap";

const Home: React.FC<{}> = () => {
  return (
    <>
      <Container className="justify-content-center text-center">
        <p>Welcome to MiniCMS!</p>
      </Container>
    </>
  );
};

export default Home;
