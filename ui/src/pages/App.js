import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';
import rootReducer from '../reducers/root';
import DispatcherFactory from '../dispatcher/DispatcherFactory';

const store = createStore(rootReducer);
DispatcherFactory.setDispatchingStrategy(store);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.body
);
