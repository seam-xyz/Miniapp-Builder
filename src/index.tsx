import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { IonApp, setupIonicReact } from '@ionic/react';
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";

setupIonicReact();

const defaultTheme = createTheme({
  palette: {
    primary: {        // Page Background
      main: "#FEFEFE"
    },
    secondary: {
      main: "#FEFEFE"  // Block Background (Profile, ect. Buttons take on the info)
    },
    info: {
      main: "#0288D1"
    }
  },
  typography: {
    fontFamily: "Public Sans"
  }
});

ReactDOM.render(
  <React.StrictMode>
    <IonApp className="seam">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={defaultTheme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </IonApp>
  </React.StrictMode>,
  document.getElementById("root")
);
