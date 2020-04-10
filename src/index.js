
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
// import { App } from './app';
import { ConnectedApp } from './App';
import { appHistory } from './history';

const jsx =   <Provider store={configureStore()}>
<Router history={appHistory}>
  <Route path="/" component={ConnectedApp} />
</Router>
</Provider>

ReactDOM.render(
  jsx,
  document.getElementById('root'));
/* import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { AppointmentsDayView } from './AppointmentsDayView';
import { sampleAppointments } from './sampleData';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';
//const jx = <AppointmentsDayView appointments={sampleAppointments} />;
const jx = <AppointmentForm  />; 
//const jx = <CustomerForm />;

ReactDOM.render(
  jx,
  document.getElementById('root')
); */