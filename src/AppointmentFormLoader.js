import React, {useEffect, useState} from 'react';
import { AppointmentForm } from './AppointmentForm';

export const AppointmentFormLoader = (props) => {

    useEffect(() => {
        const fetchAvailableTimeSlots = async () => {
        const result =await  window.fetch('/availableTimeSlots', {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' }
          });
        setAvailableTimeSlots(await result.json());
        };
    
        fetchAvailableTimeSlots();
      }, []);
      const [ availableTimeSlots, setAvailableTimeSlots ] = useState(
        []
      );

    return (
        <AppointmentForm
          {...props} 
          availableTimeSlots={availableTimeSlots} 
        />
    );
};

