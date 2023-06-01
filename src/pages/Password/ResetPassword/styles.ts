import styled from 'styled-components';

export const Content = styled.div`
  width: 320px;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  padding: 30px;

  img {
    width: 180px;
  }

  & Form {
    margin-top: 25px;

    > div {
      margin-bottom: 20px;
    }

    button {
      width: 100%;
    }
  }
`;

export const Background = styled.div`
  height: 100vh;
  flex: 1;
  display: flex;
  background: #eff1f4;
  background-size: cover;
  justify-content: center;
  align-items: center;
`;
