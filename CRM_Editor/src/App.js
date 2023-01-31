import './App.css';

import {Provider} from 'react-redux';
import rootReducer from './reducer';
import rootSaga from './sagas';
import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, createStore } from 'redux';
import Rutas from './Components/Rutas/Rutas';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyDxuYEHXRfMfNLkxdia2xoR6w-nGDJfr4E",
    authDomain: "sistemas-delsud.firebaseapp.com",
    projectId: "sistemas-delsud",
    storageBucket: "sistemas-delsud.appspot.com",
    messagingSenderId: "1060127116113",
    appId: "1:1060127116113:web:23a601b0c74fd0bb226170",
    measurementId: "G-TLK1R4EN2J"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const sagasMiddleware = createSagaMiddleware()
  const store = createStore(rootReducer, applyMiddleware(sagasMiddleware))
  sagasMiddleware.run(rootSaga)

  return (
    <Provider store={store}>
      <Rutas/>
    </Provider>

    
  );
}
  export default App;