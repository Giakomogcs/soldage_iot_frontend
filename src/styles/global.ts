import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    outline:0;
    font-family: 'Roboto'
  }


#root {
  display: flex;
}


  body {
    background: #FFF ;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility !important;
    font-family: 'Roboto', sans-serif;


  }

  .disabled {
    cursor: not-allowed;
    color: #c4c6c8;
    border-color: #c4c6c8;

     :hover{
       background-color: transparent;
       color: #c4c6c8;
     }
  }

  body, input, button, select {
    font: 12px "Roboto", sans-serif;
    font-weight:300;

  }

  input, select {
    border: solid 1px #c4c6c8;
  }

  h1,h2,h3,h4,strong{
    font-weight: 500;
    font-family: 'Roboto', sans-serif;
  }

  a{
    text-decoration:none;
  }

  ul {
    list-style: none;

  }

  button {
    cursor: pointer;
    border: 0;
  }


`;
