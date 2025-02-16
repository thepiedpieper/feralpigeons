// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.textColor};
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  button {
    background-color: ${(props) => props.theme.primaryColor};
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
`;

export default GlobalStyle;
