import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Router from './Router';
import rootReducer from '../reducers/root';
import DispatcherFactory from '../dispatcher/DispatcherFactory';
import theme from '../theme/theme';

const store = createStore(rootReducer);
DispatcherFactory.setDispatchingStrategy(store);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  </Provider>,
  document.body
);
