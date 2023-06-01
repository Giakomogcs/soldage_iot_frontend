import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background-color: #eaecf0;
  min-height: 100vh;
  flex: 1;
`;

export const Content = styled.div`
  width: calc(100% - 230px);
  float: right;
  margin-top: 70px;
  padding: 30px;

  @media (max-width: 1072px) {
    width: calc(100% - 230px);
    padding: 0 5px;
    margin-top: 55px;
    overflow: auto;
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

  margin-top: 20px;
  color: #282a36;

  @media (max-width: 785px) {
    padding: 5px;
  }
`;

export const ControlsContainer = styled.div`
  background-color: #fff;

  padding: 10px;
  margin-bottom: -5px;

  & form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    & svg {
      margin-top: 5px;
    }

    & h3 {
      margin: 0;
      align-self: center;
      font-weight: bold;
      color: #e56b14;
    }

    & > div:first-child {
      flex: 1;
      height: 30px;
      margin-left: 0px;
    }

    & > div:nth-child(2) {
      flex: 1;
      height: 30px;
      margin-left: 10px;
    }

    & > div:nth-child(3) {
      height: 30px;
      margin-left: 10px;
      padding-left: 10px;
    }

    & > div:nth-child(4) {
      height: 30px;
      margin-left: 10px;
      padding-left: 10px;
    }

    & button {
      width: 70px;
      height: 30px;
      margin-left: 10px;
    }

    @media (max-width: 1110px) {
      & > div:first-child,
      & > div:nth-child(2),
      & > div:nth-child(3),
      & > div:nth-child(4),
      button {
        flex: 1;
        margin: 0 !important;
      }
    }

    @media (max-width: 480px) {
      & > div:first-child,
      & > div:nth-child(2),
      & > div:nth-child(3),
      & > div:nth-child(4),
      button {
        flex: 1;
        margin: 0 !important;
      }
    }
  }
`;

export const TablePlotContainer = styled.div`
  background-color: #fff;
  margin-top: 40px;
  padding: 10px;
  display: flex;
  justify-content: space-between;

  .tableContainer {
    flex: 1;
    table {
      display: flex;
      flex-direction: column;
      height: 500px;
      font-size: 0.9em;
      background-color: #fff;
      border-collapse: collapse;
      text-align: center !important;

      tr {
        width: 100%;
        display: flex;
        text-align: center !important;
      }

      th,
      td {
        justify-content: center;
        word-break: break-all;
      }

      th {
        border-bottom: solid 1px #c4c6c8;
        border-top: solid 1px #c4c6c8;
        border-left: solid 1px #c4c6c8;
      }

      th:last-child {
        border-right: solid 1px #c4c6c8;
      }

      td {
        border-bottom: solid 1px #c4c6c8;
        border-left: solid 1px #c4c6c8;
      }

      thead {
        display: flex;
        th {
          display: flex;
          width: 25%;
          font-weight: bold;
          padding: 0.4em 0;
          background-color: #e0e1e3;
          z-index: 1;
        }

        th:first-child {
          display: flex;
          font-weight: bold;
          padding: 0.4em 0;
          background-color: #e0e1e3;
          z-index: 1;
        }

        th:last-child {
          width: calc(25% + 3px);
        }
      }

      tbody {
        display: flex;
        flex-direction: column;
        overflow: scroll;

        ::-webkit-scrollbar {
          height: 1px;
          width: 3px;
          border: solid 1px #c4c6c8;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr {
          td {
            display: flex;
            width: 25%;
            padding: 0.4em 0;

            :last-child {
              width: calc(25%-3px) !important;
            }
          }

          &:hover {
            background-color: #eaecf0;
          }

          &.selected {
            background-color: #2a4d6d;
            color: white !important;

            td:nth-child(1) {
              color: #fff;
            }
          }

          td:nth-child(1) {
            color: #0085d3;
          }

          td:nth-child(1),
          td:nth-child(2) {
            justify-content: left;
            padding-left: 10px;
          }
        }
      }

      @media (max-width: 785px) {
        margin-top: 5px;
        height: calc(100% - 10px);
      }
    }
  }

  .plotContainer {
    text-align: center;
    border: solid 1px #c4c6c8;
    padding: 5px;
    flex: 1;
    height: 500px;

    & div {
      font-size: 10px;
      height: calc(100% - 50px);
      display: flex;

      canvas {
        flex: 1;
        align-self: center;
        padding: 5px;
      }
    }

    & > h2 {
      font-size: 1.1em;
      font-weight: bold;
      margin-top: 10px;

      span {
        color: #0085d3;
      }
    }

    & > h3 {
      font-size: 1em;
      font-weight: bold;
      margin-top: -5px;
      color: #464749;
    }

    .arcTime {
      color: rgb(229, 107, 20);
    }
  }

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    height: 100%;

    .tableContainer,
    .plotContainer {
      width: 100%;
    }
    tbody {
      height: 200px;
    }
  }

  @media (max-width: 540px) {
    th:nth-child(2),
    th:nth-child(3),
    td:nth-child(2),
    td:nth-child(3) {
      display: none !important;
    }

    td:first-child {
      width: 50% !important;
    }

    th:last-child {
      width: calc(50% + 2px) !important;
    }

    td:last-child {
      width: calc(50% - 2px) !important;
    }

    tbody {
      height: 200px;
    }
  }
`;

export const VariablesContainer = styled.div`
  padding: 10px 0px;
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  width: 100%;

  > div {
    width: 16%;
    padding: 5px;
    background-color: #fff;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
    border: 1px solid #c4c6c8;

    &.selected {
      border: solid 2px #f36a10;
      padding: 4px !important;
    }
    h2 {
      font-size: 13px;
    }

    @media (max-width: 1072px) {
      width: 32%;
    }

    @media (max-width: 785px) {
      width: 48%;
    }
  }
`;
