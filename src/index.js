import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentDaysView';
import { sampleAppointments } from './sampleData';
import { CustomerForm } from './CustomerForm';

//const jx = <AppointmentsDayView appointments={sampleAppointments} />;
const jx = <CustomerForm />;
ReactDOM.render(
  jx,
  document.getElementById('root')
);