import styled from 'styled-components';

export const BottomNavbarContainer = styled.div.attrs({
  className:
    'flex w-full py-6 px-9 rounded-t-lg md:rounded-none flex items-center bg-white fixed bottom-0 left-0 z-30',
})``;

export const QuoteContainer = styled.div.attrs({
  className:
    'flex md:hidden flex-col gap-2 justify-center items-center mr-auto cursor-pointer',
})``;

export const BackIconContainer = styled.div.attrs({
  className: 'hidden md:flex gap-2 mr-auto cursor-pointer',
})``;

export const InputFieldContainer = styled.div.attrs({
  className: 'flex flex-col gap-1 w-full',
})``;

export const ErrorMessageText = styled.p.attrs({
  className: 'text-rose-800 text-sm',
})``;

export const ModalWrapper = styled.div.attrs({
  className:
    'absolute top-0 left-0 h-screen w-screen bg-black/[0.65] flex justify-center items-center z-50',
})``;

export const ModalContainer = styled.div.attrs({
  className: 'bg-white rounded-lg p-10 h-full w-full md:w-fit md:h-fit',
})``;

export const IconContainer = styled.div.attrs({
  className: 'w-full flex justify-end',
})``;

export const NavbarWrapper = styled.div.attrs({
  className:
    'w-full py-6 px-9 flex items-center bg-white drop-shadow fixed top-0 z-50',
})``;

export const NavbarIconContainer = styled.div.attrs({
  className: 'md:hidden cursor-pointer',
})``;

export const InfoContainer = styled.div.attrs({
  className: 'gap-2 ml-auto items-center hidden md:flex',
})``;

export const LoaderWrapper = styled.div.attrs({
  className:
    'w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-40 bg-white',
})``;

export const ErrorWrapper = styled.div.attrs({
  className:
    'h-full flex flex-col gap-4 justify-center items-center md:justify-start md:pt-32',
})``;
