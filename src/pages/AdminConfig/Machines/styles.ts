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
  height: calc(100% - 20px);
  background-color: #fff;
  margin-top: 20px;
  padding: 30px;
  color: #282a36;

  .tableContainer {
    margin-top: 30px;
    height: calc(100% - 50px);

    @media (max-width: 785px) {
      margin-top: 5px;
      height: calc(100% - 65px);
    }
  }

  table {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: 1.1em;
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
        width: 20%;
        font-weight: bold;
        padding: 0.4em 0;
        background-color: #e0e1e3;
        z-index: 1;
      }

      th:last-child {
        width: calc(20% + 3px);
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
          width: 20%;
          padding: 0.4em 0;
        }

        td:last-child {
          width: calc(20%-5px) !important;
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

      th:nth-child(3),
      th:nth-child(4),
      th:nth-child(5),
      td:nth-child(3),
      td:nth-child(4),
      td:nth-child(5) {
        display: none;
      }

      th:nth-child(1),
      th:nth-child(2),
      td:nth-child(1),
      td:nth-child(2) {
        width: 50%;
      }

      th:nth-child(2) {
        width: calc(50% + 2px) !important;
      }
    }
  }

  @media (max-width: 785px) {
    padding: 5px;
    height: calc(100% - 10px);
  }
`;

export const ControlBar = styled.div`
  display: flex;

  input {
    height: 30px;
    width: 250px;
    padding-left: 5px;
    border: solid 1px #c4c6c8;

    ::placeholder {
      font-size: 12px;
      color: #c4c6c8;
    }

    @media (max-width: 785px) {
      width: 100%;
    }
  }

  Button {
    padding: 0 10px;
    margin-left: 10px;
    font-size: 13px;
    height: 30px;

    svg {
      margin-right: 5px;
      font-weight: bold;
      font-size: 12px;
    }

    @media (max-width: 785px) {
      width: 50%;
      margin: 5px 0;
    }
  }

  @media (max-width: 785px) {
    flex-direction: column;
  }
`;

export const Controls = styled.div`
  margin-left: auto;

  @media (max-width: 785px) {
    width: 100%;
  }
`;
