import React from 'react';
import ReactTestUtils, {act} from 'react-dom/test-utils';
import { createContainer, withEvent } from './domManipulators';
import 'whatwg-fetch';
import { AppointmentForm } from '../src/AppointmentForm';
import { 
  fetchResponseOk, 
  fetchResponseError, 
  fetchRequestBody
 } from './spyHelpers';

describe('AppointmentForm', () => {
  let render, 
      container,
      element,
      elements,
      form,
      labelFor,
      field,
      change,
      submit;
 const customer = { id: 123 };
  
  const timeSlotTable = () =>
      container.querySelector('table#time-slots');
    
  const startsAtField = index =>
      container.querySelectorAll(`input[name="startsAt"]`)[
        index
      ];
  const findOption = (dropdownNode, textContent) => {
        const options = Array.from(dropdownNode.childNodes);
        return options.find(
          option => option.textContent === textContent
        );
      };
  const today = new Date();
  const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];

  beforeEach(() => {
    ({ 
      render, 
      container,
      form,
      labelFor,
      field,
      change,
      submit,
      element 
    } = createContainer());
    jest.spyOn(window, 'fetch')
    .mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });

const expectToBeSelectField = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('SELECT');
  };
const itRendersAsATextBox = (fieldName) =>
  it('renders as a text box', () => {
    render(<AppointmentForm />);
    expectToBeSelectField(field('appointment',fieldName));
  });
const itRendersALabel = (fieldName, value)=> 
  it('renders a label ', () => {
    render(<AppointmentForm />);
    expect(labelFor(fieldName)).not.toBeNull();
    expect(labelFor(fieldName).textContent).toEqual(value);
  });
const  itAssignsAnIdThatMatchesTheLabelId = (fieldName) => 
  it('assigns an id that matches the label id ', () => {
    render(<AppointmentForm  />);
    expect(field('appointment',fieldName).id).toEqual(fieldName);
  });

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {

    itRendersAsATextBox('service'); 
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field('appointment','service').childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });
    it('lists all salon services', () => {
      const selectableServices = [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions' ];
  
        render(
          <AppointmentForm
            selectableServices={selectableServices}
          />
        );
      
        const optionNodes = Array.from(
          field('appointment','service').childNodes
        );
        const renderedServices = optionNodes.map(
          node => node.textContent
        );
        expect(renderedServices).toEqual(
          expect.arrayContaining(selectableServices)
        );
      }) 
    it('pre-selects the existing value', () => {
        const services = ['Cut', 'Blow-dry'];
        render(
          <AppointmentForm
            selectableServices={services}
            service="Blow-dry"
          />
        );
        const option = findOption(
          field('appointment','service'),
          'Blow-dry'
        );
        expect(option.selected).toBeTruthy();
      });
    itRendersALabel('service', ' Salon service '); 
    itAssignsAnIdThatMatchesTheLabelId('service');
    it('save existing values when submit', async () => {

        render(<AppointmentForm 
           service="Cut"
          />);
        submit(form('appointment'));
     /*   expect(fetchResponseOk( window.fetch)).toMatchObject({
          ['service']: 'Cut'
        });*/
        //await ReactTestUtils.Simulate.submit(form('appointment'));
      
       });

    describe('time slot table', () => {

        it('renders a table for time slots', () => {
          render(<AppointmentForm />);
          expect(timeSlotTable()).not.toBeNull();
        });
        it('renders a time slot for every half an hour between open and close times', () => {
          render(
            <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
          );
          const timesOfDay = timeSlotTable().querySelectorAll(
            'tbody >* th'
          );
          expect(timesOfDay).toHaveLength(4);
          expect(timesOfDay[0].textContent).toEqual('09:00');
          expect(timesOfDay[1].textContent).toEqual('09:30');
          expect(timesOfDay[3].textContent).toEqual('10:30');
        });
        it('renders an empty cell at the start of the header row', () => {
          render(<AppointmentForm />);
          const headerRow = timeSlotTable().querySelector(
            'thead > tr'
          );
          expect(headerRow.firstChild.textContent).toEqual('');
        });
        it('renders a week of available dates', () => {
          const today = new Date(2018, 11, 1);
          render(<AppointmentForm today={today} />);
          const dates = timeSlotTable().querySelectorAll(
            'thead >* th:not(:first-child)'
          );
          expect(dates).toHaveLength(7);
          expect(dates[0].textContent).toEqual('Sat 01');
          expect(dates[1].textContent).toEqual('Sun 02');
          expect(dates[6].textContent).toEqual('Fri 07');
        });

      it('renders a radio button for each time slot', () => {
          const today = new Date();
          const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
          ];
          render(
            <AppointmentForm
              availableTimeSlots={availableTimeSlots}
              today={today}
            />
          );
          const cells = timeSlotTable().querySelectorAll('td');
          expect(
            cells[0].querySelector('input[type="radio"]')
          ).not.toBeNull();
          expect(
            cells[7].querySelector('input[type="radio"]')
          ).not.toBeNull();
        });

        it('does not render radio buttons for unavailable time slots', () => {
          render(<AppointmentForm 
            availableTimeSlots={[]} 
            customer={customer}
            />);
          const timesOfDay = timeSlotTable().querySelectorAll(
            'input'
          );
          expect(timesOfDay).toHaveLength(0);
        });

        it('sets radio button values to the index of the corresponding appointment', () => {
          const today = new Date();
          const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
          ];
          render(
            <AppointmentForm
              availableTimeSlots={availableTimeSlots}
              today={today}
              customer={customer}
            />);
          expect(startsAtField(0).value).toEqual(
            availableTimeSlots[0].startsAt.toString()
          );
          expect(startsAtField(1).value).toEqual(
            availableTimeSlots[1].startsAt.toString()
          );
        });

        it('saves existing value when submitted', async () => {
          render(
            <AppointmentForm
              customer={customer}
              availableTimeSlots={availableTimeSlots}
              today={today}
              startsAt={availableTimeSlots[0].startsAt}
            />
          );
          await submit(form('appointment'));
        
          expect(fetchResponseOk(window.fetch)).toMatchObject({
            startsAt: availableTimeSlots[0].startsAt
          });
        });

        it('saves new value when submitted', () => {
        //  expect.hasAssertions();    
          render(
            <AppointmentForm
              customer={customer}
              availableTimeSlots={availableTimeSlots}
              today={today}
              startsAt={availableTimeSlots[0].startsAt}
            />
          );
    /*     change(
          field('appointment','startAt' ), //field(fieldName),
          withEvent('startAt', availableTimeSlots[1].startsAt.toString())
         )*/
        /*  ReactTestUtils.Simulate.change(startsAtField(1), {
            target: {
              value: availableTimeSlots[1].startsAt.toString(),
              name: 'startsAt'
            }
          });*/
          submit('appointment')
         // ReactTestUtils.Simulate.submit(form('appointment'));
        });

        it('passes the customer id to fetch when submitting', async () => {
       
            render(<AppointmentForm customer={customer} />);
            await submit(form('appointment'));
            expect(fetchResponseOk(window.fetch)).toMatchObject({
              customer: customer.id
            });
          });
      
      });
  });

 

});