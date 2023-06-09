import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type?: 'success' | 'error' | 'info';
  // hasdescription: boolean;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #efdded;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  position: relative;
  padding: 16px 30px 16px 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px 1px #bdbdbd;

  display: flex;

  & + div {
    margin-top: 8px;
  }

  ${props => toastTypeVariations[props.type || 'info']}

  > svg {
    margin: 5px 10px 0 0;
  }

  div {
    flex: 1;
    margin-right: 5px;
    p {
      margin-top: 4px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 12px;
    top: 12px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }
`;
