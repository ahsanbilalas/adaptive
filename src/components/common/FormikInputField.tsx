import React from "react";
import map from "lodash/map";
import Input from "@/elements/inputs/Input";
import SelectInput from "@/elements/inputs/SelectInput";
import { ErrorMessageText, InputFieldContainer } from "@/components/common/style";

type Props = {
  label?: string;
  type?: string;
  name: string;
  handleChange: any;
  handleBlur: any;
  value: string;
  placeholder?: string;
  error?: string | any;
  touched?: boolean | any;
  as?: string;
  options?: Array<{ value: string; label: string }>;
  pattern?: string;
};

const FormikInputField = (props: Props, ref: any) => {
  return (
    <InputFieldContainer>
      {props.label && <p>{props.label}</p>}

      {props.as === "select" && props.options ? (
        <SelectInput
          id={props.name}
          name={props.name}
          onChange={props.handleChange}
          value={props.value}
        >
          <option disabled value="">
            Select
          </option>
          {map(props.options, (item: any, index: number) => (
            <option value={item.value} key={index}>
              {item.label}
            </option>
          ))}
        </SelectInput>
      ) : (
        <Input
          ref={ref}
          id={props.name}
          placeholder={props.placeholder}
          type={props.type}
          name={props.name}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.value}
        />
      )}

      {props.error && props.touched && (
        <ErrorMessageText>{props.error}</ErrorMessageText>
      )}
    </InputFieldContainer>
  );
};

export default React.forwardRef(FormikInputField);
