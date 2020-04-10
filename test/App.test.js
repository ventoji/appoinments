import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import {
    id,
    click,
    className,
    childrenOf,
    createShallowRenderer,
    type,
    prop
} from './shallowHelpers';
import { App, MainScreen } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { CustomerForm } from '../src/CustomerForm';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';
import { CustomerSearchRoute } from '../src/CustomerSearchRoute';

describe('MainScreen', () => {
  let render, child, elementMatching;

  beforeEach(() => {
    ({ render, child, elementMatching } = createShallowRenderer());
  });

  it('renders a button bar as the first child', () => {
    render(<MainScreen />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('renders an AppointmnentsDayViewLoader', () => {
    render(<MainScreen />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });

  it('renders a Link to /addCustomer', () => {
    render(<MainScreen />);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[0].type).toEqual(Link);
    expect(links[0].props.to).toEqual('/addCustomer');
    expect(links[0].props.className).toEqual('button');
    expect(links[0].props.children).toEqual(
      'Add customer and appointment'
    );
  });

  it('renders a Link to /searchCustomers', () => {
    render(<MainScreen />);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[1].type).toEqual(Link);
    expect(links[1].props.to).toEqual('/searchCustomers');
    expect(links[1].props.className).toEqual('button');
    expect(links[1].props.children).toEqual('Search customers');
  });

});


describe('App', () => {
  let render, child, elementMatching;
  let historySpy;

  beforeEach(() => {
    ({ 
      render, 
      child, 
      elementMatching 
    } = createShallowRenderer());
    historySpy = jest.fn();
  });

  const switchElement = () => elementMatching(type(Switch));
  const childRoutes = () =>
    childrenOf(elementMatching(type(Switch)));

  const routeFor = path => childRoutes().find(prop('path', path));

  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(elementMatching(id('addCustomer')));
  };

  const saveCustomer = customer =>
  elementMatching(type(CustomerForm)).props.onSave(customer);

  it('renders the MainScreen as the default route', () => {
    render(<App />);
    const routes = childRoutes();
    const lastRoute = routes[routes.length - 1];
  //  console.log(lastRoute);
    expect(lastRoute.props.component).toEqual(MainScreen);
  });

  it('renders CustomerForm at the /addCustomer endpoint', () => {
    render(<App />);
    expect(routeFor('/addCustomer').props.component).toEqual(
      CustomerForm
    );
  });

  it('renders AppointmentFormLoader at /addAppointment', () => {
    render(<App />);
    expect(
      routeFor('/addAppointment').props.render().type
    ).toEqual(AppointmentFormLoader);
  });

  it('renders CustomerSearchRoute at /searchCustomers', () => {
    render(<App />);
    expect(
      routeFor('/searchCustomers').props.render().type
    ).toEqual(CustomerSearchRoute);
  });

  const customer = { id: 123 };

  it('navigates to / when AppointmentFormLoader is saved', () => {
    render(<App history={{ push: historySpy }} />);
    const onSave = routeFor('/addAppointment').props.render().props
      .onSave;
    onSave();
    expect(historySpy).toHaveBeenCalledWith('/');
  });



it('renders CustomerForm at the /addCustomer endpoint', () => {
  render(<App />);
  expect(routeFor('/addCustomer').props.component).toEqual(
    CustomerForm
  );
});

describe('search customers', () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = jest.fn();
  });

  /* const saveAppointment = () =>
  elementMatching(
    type(AppointmentFormLoader)
  ).props.onSave(); */

/*   const renderSearchActionsForCustomer = customer => {
    searchCustomers();
    const customerSearch = elementMatching(type(CustomerSearch));
    const searchActionsComponent =
      customerSearch.props.renderCustomerActions;
    return searchActionsComponent(customer);
  }; */
  const renderSearchActionsForCustomer = customer => {
    render(
      <App
        history={{ push: historySpy }}
        setCustomerForAppointment={dispatchSpy}
      />
    );
    const customerSearch = routeFor(
      '/searchCustomers'
    ).props.render();
    const searchActionsComponent =
      customerSearch.props.renderCustomerActions;
    return searchActionsComponent(customer);
  };

  it('passes a button to the CustomerSearch named Create appointment', () => {
    const button = childrenOf(
      renderSearchActionsForCustomer()
    )[0];
    expect(button).toBeDefined();
    expect(button.type).toEqual('button');
    expect(button.props.role).toEqual('button');
    expect(button.props.children).toEqual('Create appointment');
  });

  it('navigates to /addAppointment when clicking the Create appointment button', () => {
    const button = childrenOf(
      renderSearchActionsForCustomer(customer)
    )[0];
    click(button);
    expect(historySpy).toHaveBeenCalledWith('/addAppointment');
  });

  it('passes saved customer to AppointmentFormLoader when clicking the Create appointment button', () => {
    const button = childrenOf(
      renderSearchActionsForCustomer(customer)
    )[0];
    click(button);
    expect(dispatchSpy).toHaveBeenCalledWith(customer);
  });

  it.skip('passes a button to the CustomerSearch named View history', () => {
    const button = childrenOf(
      renderSearchActionsForCustomer(customer)
    )[1];
    expect(button.type).toEqual('button');
    expect(button.props.role).toEqual('button');
    expect(button.props.children).toEqual('View history');
  });



  });

});


 /*  it('initially shows the AppointmentDayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  }); */
/*
  it('has a button bar as the first child', () => {
    render(<App />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });*/
/*
  it('has a button to initiate add customer and appointment action', () => {
    render(<App />);
    const buttons = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual(
      'Add customer and appointment'
    );
  });
 */ 
/*
  it('displays the CustomerForm when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined();
  });

  it('hides the AppointmentDayViewLoader when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).not.toBeDefined();
  });
  it('hides the button bar when CustomerForm is being displayed', async () => {
    beginAddingCustomerAndAppointment();
    expect(wrapper.find('.button-bar').exists()).not.toBeTruthy();
  });

it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
  beginAddingCustomerAndAppointment();
  saveCustomer();
  expect(
    elementMatching(type(AppointmentFormLoader))
  ).toBeDefined();
  });
  it('passes the customer to the AppointmentForm', async () => {
    const customer = { id: 123 };
  
    beginAddingCustomerAndAppointment();
    saveCustomer(customer);
  
    expect(
      elementMatching(type(AppointmentFormLoader)).props
        .customer
    ).toBe(customer);
  });*/


/*
it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
  beginAddingCustomerAndAppointment();
  saveCustomer();
  saveAppointment();

  expect(
    elementMatching(type(AppointmentsDayViewLoader))
  ).toBeDefined();
});*/


/*
it('passes a button to the CustomerSearch named Create appointment', async () => {
  const button = childrenOf(
    renderSearchActionsForCustomer()
  )[0];
  expect(button).toBeDefined();
  expect(button.type).toEqual('button');
  expect(button.props.role).toEqual('button');
  expect(button.props.children).toEqual('Create appointment');
});*/
/*
it('clicking appointment button shows the appointment form for that customer', async () => {
  const customer = { id: 123 };
  const button = childrenOf(
    renderSearchActionsForCustomer(customer)
  )[0];
  click(button);
  expect(
    elementMatching(type(AppointmentFormLoader))
  ).not.toBeNull();
  expect(
    elementMatching(type(AppointmentFormLoader)).props.customer
  ).toBe(customer);
});*/