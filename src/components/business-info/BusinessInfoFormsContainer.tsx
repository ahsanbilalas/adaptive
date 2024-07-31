import React from "react";
import { Container, Title } from "./style";

type Props = {
  children: React.ReactNode;
  title: string;
};

const BusinessInfoFormsContainer = (props: Props) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <p>* Required </p>
      {props.children}
    </Container>
  );
};

export default BusinessInfoFormsContainer;
