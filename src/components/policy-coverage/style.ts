import styled from 'styled-components';

export const CoverageCardContainer = styled.div.attrs({
  className:
    'flex flex-wrap justify-around items-center md:justify-start md:items-start gap-8 mb-12',
})``;

export const CoverageLimitCard = styled.div.attrs<{
  $selectedLimit: number;
  $limit: number;
}>((props) => ({
  className:
    'border rounded-lg flex flex-col justify-center items-center p-9 w-40 md:w-36 lg:w-48 cursor-pointer ' +
    (props.$selectedLimit === props.$limit
      ? 'bg-white border-deep-blue shadow-xl'
      : 'border-gray text-gray'),
}))``;

export const Title = styled.p.attrs({
  className: 'text-5xl text-center md:text-left',
})``;

export const HoursCard = styled.div.attrs<{
  $selectedId: string;
  $id: string;
}>((props) => ({
  className:
    'border rounded-lg flex flex-col items-center w-full md:size-36 lg:size-48 p-4 cursor-pointer ' +
    (props.$selectedId === props.$id
      ? 'bg-white border-deep-blue shadow-xl'
      : 'border-gray text-gray'),
}))``;

export const ModalContainer = styled.div.attrs({
  className:
    'flex flex-col justify-center items-center gap-10  h-full w-full md:h-fit md:w-[600px] lg:w-[880px] md:pb-20 md:px-20',
})``;

export const HorizontalLine = styled.div.attrs({
  className: 'w-full border border-white border-t-gray',
})``;

export const PageWrapper = styled.div.attrs({
  className: 'flex w-full h-full px-10 py-12',
})``;

export const QuoteCardWrapper = styled.div.attrs({
  className: 'w-80 lg:w-96 grow-0 shrink-0 hidden md:block',
})``;

export const QuoteWrapper = styled.div.attrs({
  className:
    'md:w-80 lg:w-96 bg-white rounded-lg shadow-2xl py-10 px-8 flex-col items-center',
})``;

export const QuoteContainer = styled.div.attrs({
  className: 'flex md:flex-col md:items-center mb-12 md:mb-0',
})``;
