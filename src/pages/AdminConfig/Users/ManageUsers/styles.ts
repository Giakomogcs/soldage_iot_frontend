import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #eaecf0;
`;

export const Content = styled.div`
  height: calc(100% - 70px);
  width: calc(100% - 230px);
  float: right;
  margin-top: 70px;
  padding: 30px;

  @media (max-width: 785px) {
    width: calc(100% - 230px);
    padding: 0 5px;
    margin-top: 55px;
  }

  @media (max-width: 540px) {
    width: calc(100% - 50px);
    padding: 0 5px;
    margin-top: 55px;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;

  p {
    font-size: 1.7em;
    color: #282a36;
    font-weight: bold;
  }

  svg {
    margin-right: 10px;
    font-size: 1.7em;
    color: #282a36;
    font-weight: bolder;
  }

  @media (max-width: 785px) {
    display: none;
  }
`;

export const MainContent = styled.div`
  width: 100%;
  background-color: #fff;
  margin-top: 20px;
  padding: 30px;
  color: #282a36;

  p {
    font-size: 1.4em;

    @media (max-width: 785px) {
      display: none;
    }
  }

  hr {
    width: calc(100% + 60px);
    margin-left: -30px;
    margin-top: 25px;
    border: none;
    height: 1px;
    color: #c4c6c8;
    background-color: #c4c6c8;

    @media (max-width: 785px) {
      width: calc(100% + 20px);
      margin-left: -10px;
    }
  }

  form {
    margin-top: 30px;
    width: 50%;

    > div {
      margin-top: 30px;
    }

    @media (max-width: 785px) {
      width: 100%;
    }
  }

  @media (max-width: 785px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export const ControlBar = styled.div`
  width: 100%;
  display: flex;
  height: 30px;

  div {
    display: flex;
  }

  input {
    height: 30px;
    padding-left: 5px;
    border: solid 1px #c4c6c8;
    ::placeholder {
      font-size: 12px;
      color: #c4c6c8;
    }
  }
`;

export const Controls = styled.div`
  margin-left: auto;

  Button {
    padding: 0 10px;
    margin-left: 10px;
    font-size: 13px;
    height: 30px;

    @media (max-width: 785px) {
      width: 50%;
      margin-left: 0;
    }

    svg {
      margin-right: 5px;
      font-weight: bold;
      font-size: 12px;
    }
  }

  @media (max-width: 785px) {
    width: 100%;
  }
`;

export const CheckGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;

  input {
    height: 17px;
    width: 17px;
  }

  input[type='checkbox']:checked:after {
    background-color: green;
    background-image: linear-gradient(135deg, #b1b6be 0%, #fff 100%);
  }

  h3 {
    margin-left: 10px;
    margin-top: 0px;
    font-size: 15px;
  }
`;
