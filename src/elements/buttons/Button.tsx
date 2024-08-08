import { theme } from '@/config/themeConfig';
import styled from 'styled-components';

const Button = styled.button<{ width?: string }>`
  background-color: ${theme.colors.primary.light};
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  padding: 12px;
  border-radius: 6px;
  width: ${(props) => props.width};
`;

export default Button;
