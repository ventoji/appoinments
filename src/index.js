import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { AppointmentsDayView } from './AppointmentDaysView';
import { sampleAppointments } from './sampleData';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';
//const jx = <AppointmentsDayView appointments={sampleAppointments} />;
//const jx = <AppointmentForm  />; 
const jx = <CustomerForm />;

ReactDOM.render(
  jx,
  document.getElementById('root')
);