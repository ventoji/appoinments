import React from 'react';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  
  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
   /* expect(
      container.querySelector('form[id="customer"]')
    ).not.toBeNull();
    */
  });
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  it('renders the first name field as a text box', () => {
    render(<CustomerForm />);
    const field = form('customer').elements.firstName;
    expectToBeInputFieldOfTypeText(field)
    /* expect(field).not.toBeNull();
    expect(field.tagName).toEqual('INPUT');
    expect(field.type).toEqual('text'); */
  });

});