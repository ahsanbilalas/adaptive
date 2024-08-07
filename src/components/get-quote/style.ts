import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className:
    'w-full md:w-3/5 flex flex-col md:justify-center items-center gap-8 md:gap-16',
})``;

export const LogoContainer = styled.div.attrs({
  className: 'w-full flex flex-col items-center gap-6 md:gap-8',
})``;

export const InputFormContainer = styled.form.attrs({
  className: 'w-full flex flex-col items-center gap-3 md:gap-16',
})``;

export const PageWrapper = styled.div.attrs({
  className: 'w-full h-full flex justify-center items-center p-6',
})``;

export const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
  display: inline-block;
`;

export const AutocompleteItems = styled.div`
  position: absolute;
  z-index: 99;
  top: 90%;
  left: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  max-height: 400px;
  overflow: auto;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const AutocompleteOptions = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;

  :hover {
    background-color: #e9e9e9;
  }
`;
