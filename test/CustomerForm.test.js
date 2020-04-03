import React from 'react';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import ReactTestUtils from 'react-dom/test-utils';

describe('CustomerForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  //const firstNameField = () => form('customer').elements.firstName;
  const field = name => form('customer').elements[name];

 it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };
  const labelFor = formElement =>
  container.querySelector(`label[for="${formElement}"]`);
  const itRendersAsATextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
  it('includes the existing value', () => {
    render(<CustomerForm { ...{[fieldName]: 'value'} } />);
    expect(field(fieldName).value).toEqual('value');
  });
  const itRendersALabel = (fieldName, value)=> it('renders a label ', () => {
    render(<CustomerForm />);
    expect(labelFor(fieldName)).not.toBeNull();
    expect(labelFor(fieldName).textContent).toEqual(value);
  });

  const  itAssignsAnIdThatMatchesTheLabelId = (fieldName) => it('assigns an id that matches the label id ', () => {
    render(<CustomerForm />);
    expect(field(fieldName).id).toEqual(fieldName);
  });

  const  itSubmitsExistingValue = (fieldName, value) => 
  it('saves existing when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
      { ...{[fieldName]: value} }
        onSubmit={props =>
          expect(props[fieldName]).toEqual(value)
        }
      />
    );
    await ReactTestUtils.Simulate.submit(form('customer'));
  
  }); 

  const itSubmitsNewValue = (fieldName, value) =>
  it('saves new value when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
        { ...{[fieldName]: value} }
        onSubmit={props =>
          expect(props[fieldName]).toEqual(value)
        }
      />);
    await ReactTestUtils.Simulate.change(field(fieldName), {
      target: { value, name: fieldName }
    });
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

  
  describe('first name field', () => {
 
  itRendersAsATextBox('firstName');

/*   it('renders as a text box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(field('firstName'))
  }); */
  itIncludesTheExistingValue('firstName');

 /*  it('includes the existing value for the first name', () => {
    render(<CustomerForm firstName="Ashley" />);
    expect(field('firstName').value).toEqual('Ashley');
  }); */

 itRendersALabel('firstName', 'First name');

 itAssignsAnIdThatMatchesTheLabelId('firstName');
 itSubmitsExistingValue('firstName', 'firstName');

/* it('assigns an id that matches the label id ', () => {
  render(<CustomerForm />);
  expect(field('firstName').id).toEqual('firstName');
}); */

/* it('saves existing when submitted', async () => {
  expect.hasAssertions();
  render(
    <CustomerForm
      firstName="Ashley"
      onSubmit={({ firstName }) =>
        expect(firstName).toEqual('Ashley')
      }
    />
  );
  await ReactTestUtils.Simulate.submit(form('customer'));

}); */

itSubmitsNewValue('firstName', 'anotherfirstName');
/* it('saves new values when submitted', async () => {
  expect.hasAssertions();
  render(
    <CustomerForm
      firstName="Ashley"
      onSubmit={({ firstName }) =>
        expect(firstName).toEqual('Jamie')
      }
    />
  ); 
  await ReactTestUtils.Simulate.change( field('firstName'), {
    target: { value: 'Jamie' }
  });
  await ReactTestUtils.Simulate.submit(form('customer'));
}); */

  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'lastName');
    itSubmitsNewValue('lastName', 'anotherlasttName');
    
  });
  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', 'phoneNumber');
    itSubmitsNewValue('phoneNumber', 'anotherphoneNumber');
    
  });
  
  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });
});

