import React, {useState} from 'react';

const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
  }

export const Appointment = ({customer,startsAt}) => {

    return (
        <div>
        <h1> Today's appointment at {startsAt} </h1>
        <table>
  <tr>
    <th> Customer</th>
    <th>{customer.firstName}</th>
  </tr>
  <tr>
    <td>Phone Number</td>
    <td>{customer.phoneNumber}</td>
  </tr>
  <tr>
    <td>Stylist</td>
    <td>{customer.stylist}</td>
  </tr>
  <tr>
    <td>Service</td>
    <td>{customer.service}</td>
  </tr>
  <tr>
    <td>Notes</td>
    <td>{customer.notes}</td>
  </tr>
</table>
        </div>
    );
};

export const AppointmentsDayView = ({appointments}) =>{ 
    const [selectedAppointment, setSelectedAppointment] = useState(
        0
      );
    return (<div id="appointmentsDayView">
    <ol> {
    appointments.map((appointment,i) => (
        <li key={appointment.startsAt}>
            <button 
            type="button"
            onClick={() => setSelectedAppointment(i)}
            >
                {appointmentTimeOfDay(appointment.startsAt)}
            </button>
        </li>
      ))}
    </ol>
    {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today.</p>
    ) : (
        <Appointment {...appointments[selectedAppointment]} />
      )}
</div>);
    }