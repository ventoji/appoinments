import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentDaysView';
import { sampleAppointments } from './sampleData';

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  document.getElementById('root')
);