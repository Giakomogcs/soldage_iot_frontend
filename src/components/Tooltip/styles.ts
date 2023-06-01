import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 160px;
    background: #2a4d6d;
    padding: 8px;
    border-radius: 4px;
    font-weight: 500;
    text-align: center;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;
    margin-left: 5px;
    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    color: #fff;

    &::before {
      content: '';
      border-style: solid;
      border-color: #2a4d6d transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
  @media (min-width: 1024px) {
    span {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    span {
      left: -70%;
      &::before {
        left: 75%;
      }
    }
  }
`;
