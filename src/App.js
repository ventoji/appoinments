import React, {useState, useCallback} from 'react';
//import ReactDOM from 'react-dom';
//import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';
//import { CustomerSearch } from './CustomerSearch';
import { CustomerSearchRoute } from './CustomerSearchRoute';
//import { MainScreen } from './MainScreen';
import {Link, Switch, Route } from 'react-router-dom';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { connect } from 'react-redux';



export const MainScreen = () => (
  <React.Fragment>
    <div className="button-bar">
      <Link to="/addCustomer" className="button">
        Add customer and appointment
      </Link>
      <Link to="/searchCustomers" className="button">
        Search customers
      </Link>
    </div>
    <AppointmentsDayViewLoader />
  </React.Fragment>
);

export const App = ({ history,setCustomerForAppointment}) => {

    const [view, setView] = useState('dayView');
    const [today, setToday] = useState(new Date());
    const [customer, setCustomer] = useState();

    const transitionToAddCustomer = useCallback(
      () => setView('addCustomer'),
      []
    );
    
  /*   const transitionToAddAppointment = useCallback(customer => {
      setCustomer(customer);
      setView('addAppointment');
    }, []); */

    const transitionToAddAppointment = customer => {
      setCustomerForAppointment(customer);
      history.push('/addAppointment');
    };
    
    const searchActions = customer => (
      <React.Fragment>
        <button
          role="button"
    onClick={() => transitionToAddAppointment(customer)}>
          Create appointment
        </button>
      </React.Fragment>
    );
    


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
            <Route path="/addCustomer" component={CustomerForm} />
              <Route path="/addAppointment"  render={() => (
                <AppointmentFormLoader 
                  onSave={transitionToDayView} />
              )} />
              <Route
              path="/searchCustomers"
              render={props => (
                <CustomerSearchRoute
                  {...props}
                  renderCustomerActions={searchActions}
                />
              )}
            />
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

const mapDispatchToProps = {
  setCustomerForAppointment: customer => ({
    type: 'SET_CUSTOMER_FOR_APPOINTMENT',
    customer
  })
};

export const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App);