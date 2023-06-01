import styled from 'styled-components';

export const Aside = styled.div`
  position: fixed;
  left: 0;
  width: 230px;
  background-color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  & ul {
    list-style: none;
    margin-top: 80px;
    width: 100%;
    font-weight: bold;

    & li {
      width: 100%;
      padding-top: 23px;
      padding-bottom: 23px;
      display: flex;

      & button {
        background: transparent;
        color: #282a36;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        width: 100%;
      }

      div {
        width: 100%;
      }

      a {
        display: flex;
        width: 100%;
      }

      & p {
        color: #282a36;
        font-size: 15px;
      }

      svg {
        color: #282a36;
        font-size: 18px;
        margin-left: 30px;
        margin-right: 10px;
      }

      &:hover,
      &.selectedItem {
        cursor: pointer;
        background-color: #2a4d6d;
        color: #fff;

        button {
          color: #fff;
        }

        p {
          color: #fff;
        }

        svg {
          color: #fff;
        }
      }
    }
  }

  @media (max-width: 540px) {
    width: 50px;

    & p {
      display: none;
    }

    a,
    li {
      justify-content: center;
    }

    svg {
      margin: 0 !important;
    }
  }
`;

export const Container = styled.div`
  height: 70px;
  right: 0;
  position: absolute;
  width: 100%;
  display: flex;
  background-color: #fff;
  box-shadow: 0 0 4px 0px #bdbfc1;

  & > div.appContent {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 30px;

    & header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 110px;

      & img.logo {
        display: block;
        width: 150px;
      }

      & > div.headerUser {
        display: flex;
        align-items: center;

        > p {
          font-size: 13px;
          color: #282a36;
          margin: 0px;
          margin-right: 15px;
        }

        & div.userAvatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #2a4d6d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          & > img {
            width: 100%;
          }
          > svg {
            font-size: 15px;
            color: #fff;
            margin-top: -3px;
          }
        }

        @media (max-width: 480px) {
          p {
            display: none;
          }
        }
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
`;

export const NavFooter = styled.div`
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;

  p {
    font-size: 10px;
    font-weight: normal;
  }
`;
