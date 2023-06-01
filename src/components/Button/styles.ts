import styled from 'styled-components';

interface IContainer {
  isLoading?: boolean;
}

export const Container = styled.button<IContainer>`
  color: #2a4d6d;
  height: 35px;
  font-weight: bold;
  font-size: 12px;
  background: transparent;
  border: solid 1px #2a4d6d;
  &:hover {
    background: #2a4d6d;
    color: #fff;
  }

  svg {
    vertical-align: middle;
  }
`;
