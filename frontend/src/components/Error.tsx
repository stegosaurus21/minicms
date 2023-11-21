import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import style from "../styles.module.css";

const ErrorPage = (props: { message: string }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <span className={style.returnLink} onClick={() => navigate("./..")}>
        {"<"} Back
      </span>
      <h1>Error</h1>
      <p>{props.message}</p>
    </Container>
  );
};

export default ErrorPage;
