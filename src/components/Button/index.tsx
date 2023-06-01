import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface InputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<InputProps> = ({ children, isLoading, ...rest }) => (
  <Container type="submit" {...rest} isLoading={isLoading}>
    {children}
  </Container>
);
export default Button;
