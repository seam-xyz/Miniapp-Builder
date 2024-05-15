import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { IonApp, setupIonicReact } from '@ionic/react';

setupIonicReact();

ReactDOM.render(
  <React.StrictMode>
      <IonApp className="seam">
        <App />
      </IonApp>
  </React.StrictMode>,
  document.getElementById("root")
);
