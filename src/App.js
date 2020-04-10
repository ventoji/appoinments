import React, {useState, useCallback} from 'react';
//import ReactDOM from 'react-dom';
//import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { CustomerSearch } from './CustomerSearch';
import { MainScreen } from './MainScreen';
import {Switch, Route } from 'react-router-dom';

const searchActions = customer => (
  <React.Fragment>
    <button
      role="button"
onClick={() => transitionToAddAppointment(customer)}>
      Create appointment
    </button>
  </React.Fragment>
);

export const App = () => {

    const [view, setView] = useState('dayView');
    const [today, setToday] = useState(new Date());
    const [customer, setCustomer] = useState();
    
    const transitionToAddCustomer = useCallback(
        () => setView('addCustomer'),
        []
      );

    const transitionToAddAppointment = useCallback(customer => {
        setCustomer(customer);
        setView('addAppointment');
      }, []);

    const transitionToDayView = useCallback(
      () => history.push('/'),
      [history]
   //     () => setView('dayView'),
    //    []
      );

/*       switch (view) {
        case 'addCustomer':
          return (
            <CustomerForm onSave={transitionToAddAppointment}/>
          );
        case 'addAppointment':
            return (
              <AppointmentFormLoader  
                customer={customer}
                onSave={transitionToDayView}
                />
          );
      case 'searchCustomers':
            return (
              <CustomerSearch renderCustomerActions={searchActions} />
            );
        default: */

          return (
            <Switch>
              <Route path="/addCustomer" render={()=>(
                <CustomerForm onSave={transitionToAddAppointment}/>
              )} />
              <Route path="/addAppointment"  render={() => (
                <AppointmentFormLoader
                  customer={customer}
                  onSave={transitionToDayView} />
              )} />
              <Route path="/searchCustomers" render={()=>(
                <CustomerSearch  renderCustomerActions={searchActions}/>)
              } />
              <Route component={MainScreen} />
            </Switch>
          );
/*           return (
            <React.Fragment>
              <div className="button-bar">
                <button
                  type="button"
                  id="addCustomer"
                  onClick={transitionToAddCustomer}>
                  Add customer and appointment
                </button>
              </div>
              <AppointmentsDayViewLoader today={today} />
            </React.Fragment>
          ); */
    //  }

};