import React from 'react';
import {
    id,
    click,
    className,
    childrenOf,
    createShallowRenderer,
    type
} from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { CustomerForm } from '../src/CustomerForm';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';


describe('App', () => {
  let render, child, elementMatching;

  beforeEach(() => {
    ({ render, child, elementMatching } = createShallowRenderer());
  });
  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(elementMatching(id('addCustomer')));
  };

  const saveCustomer = customer =>
  elementMatching(type(CustomerForm)).props.onSave(customer);


  it('initially shows the AppointmentDayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });

  it('has a button bar as the first child', () => {
    render(<App />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });
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
  });

  const saveAppointment = () =>
  elementMatching(
    type(AppointmentFormLoader)
  ).props.onSave();

it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
  beginAddingCustomerAndAppointment();
  saveCustomer();
  saveAppointment();

  expect(
    elementMatching(type(AppointmentsDayViewLoader))
  ).toBeDefined();
});
});