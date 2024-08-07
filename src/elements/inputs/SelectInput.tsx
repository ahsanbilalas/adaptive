import styled from "styled-components";

const SelectInput = styled.select`
  padding: 20px;
  border-radius: 8px;
  width: 100%;

  -webkit-appearance: none;
  appearance: none;

  background-image: url("/chevron-down.svg");
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: calc(100% - 16px) center;
`;

export default SelectInput;
