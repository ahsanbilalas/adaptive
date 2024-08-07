import { InputFieldContainer } from "@/components/common/style";
import Input from "@/elements/inputs/Input";
import React from "react";

type Props = {
  label?: string;
  type?: string;
  value: string | number;
};

const DisabledInputField = (props: Props) => {
  return (
    <InputFieldContainer>
      {props.label && <p>{props.label}</p>}
      <Input className="bg-white" type={props.type} value={props.value} disabled />
    </InputFieldContainer>
  );
};

export default DisabledInputField;
