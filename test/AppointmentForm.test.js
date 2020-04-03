import React from 'react';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id =>
    container.querySelector(`form[id="${id}"]`);

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    const field = name => form('appointment').elements[name];

    it('renders as a select box', () => {
        render(<AppointmentForm />);
    /*     expect(form('appointment').elements.service)
          .not.toBeNull();
        expect(form('appointment').elements.service.tagName)
          .toEqual('SELECT'); */
          expect(field('service')).not.toBeNull();
          expect(field('service').tagName).toEqual('SELECT');
      });

      
});
 

});