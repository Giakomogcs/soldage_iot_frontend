import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface containerInterface {
  error: boolean;
}

export const Container = styled.div<containerInterface>`
  height: 35px;
  display: flex;
  border: 1px solid #c4c6c8;
  background: #fff;
  padding: 10px;
  align-items: center;

  & select {
    border: none;
    flex: 1;
    color: #373435;
    background: transparent;
    &::placeholder {
      color: #c4c6c8;
      font-size: 12px;
    }
  }

  ${props =>
    props.error &&
    css`
      border-color: #c53030;
    `}
`;

export const Error = styled(Tooltip)`
  padding-left: 10px;

  svg {
    margin: 0;
  }
`;
