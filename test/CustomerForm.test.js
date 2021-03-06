import React from 'react';
import { CustomerForm } from '../src/CustomerForm';
//import  { act } from 'react-dom/test-utils';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import 'whatwg-fetch';
import { expectRedux } from 'expect-redux';
import { 
    createContainerWithStore,
    withEvent 
  } from './domManipulators';
import { 
  fetchResponseOk, 
  fetchResponseError, 
  fetchRequestBody
 } from './spyHelpers';

describe('CustomerForm', () => {
  let render, element,form, blur, field, labelFor, change, submit;
  let store, renderWithStore;
  // let fetchSpy;
 const validCustomer = {
  firstName: 'first',
  lastName: 'last',
  phoneNumber: '123456789'
};

  beforeEach(() => {
    ({ render, 
      element,
      form,
      field,
      labelFor,
      change,
      store,
      renderWithStore,
      submit,
      blur
    } = createContainerWithStore());
  //  fetchSpy = jest.fn(() => fetchResponseOk({}));
   // window.fetch = fetchSpy;
    jest.spyOn(window, 'fetch')
    .mockReturnValue(fetchResponseOk({}));
 /*    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.mockReturnValue(fetchResponseOk({})); */
  });

  afterEach(() => {
    //window.fetch = originalFetch;
    window.fetch.mockRestore();
  });


 it('renders a form', () => {
    renderWithStore(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };


  const itRendersAsATextBox = (fieldName) =>
    it('renders as a text box', () => {
      renderWithStore(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
  it('includes the existing value', () => {
    renderWithStore(<CustomerForm { ...{[fieldName]: 'value'} } />);
    expect(field('customer', fieldName).value).toEqual('value');
  });
  const itRendersALabel = (fieldName, value)=> it('renders a label ', () => {
    renderWithStore(<CustomerForm />);
    expect(labelFor(fieldName)).not.toBeNull();
    expect(labelFor(fieldName).textContent).toEqual(value);
  });

  const  itAssignsAnIdThatMatchesTheLabelId = (fieldName) => it('assigns an id that matches the label id ', () => {
    renderWithStore(<CustomerForm />);
    expect(field('customer', fieldName).id).toEqual(fieldName);
  });

  const itSubmitsExistingValue = fieldName =>
  it('saves existing value when submitted', async () => {
    //const fetchSpy = spy();

    //render(<CustomerForm {...validCustomer} />);
    renderWithStore(
      <CustomerForm
        {...validCustomer}
        {...{ [fieldName]: 'value' }}
      />
    );

    submit(form('customer'));
    //ReactTestUtils.Simulate.submit(form('customer'));

    expect(fetchRequestBody( window.fetch)).toMatchObject({
      [fieldName]: 'value'
    });

 /*    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(
      'value'
    ); */
  });

  const itSubmitsNewValue = fieldName =>
  it('saves new value when submitted', async () => {
   // const fetchSpy = spy();

   renderWithStore(
      <CustomerForm
       {...validCustomer}
        {...{ [fieldName]: 'existingValue' }}
      />
    );
   /* change(field('customer', fieldName), {
      target: { value: 'newValue', name: fieldName }
    });*/
    
    change(
      field('customer', fieldName), //field(fieldName),
      withEvent(fieldName, 'newValue')
    );
    submit(form('customer'));
   /* ReactTestUtils.Simulate.change(field('customer', fieldName), {
      target: { value: 'newValue', name: fieldName }
    });
    ReactTestUtils.Simulate.submit(form('customer'));
*/
    expect(fetchRequestBody( window.fetch)).toMatchObject({
      [fieldName]: 'newValue' // newValue
    });
 /*    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(
      'newValue'
    ); */
  });
    
  describe('first name field', () => {
 
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName');
    itSubmitsNewValue('firstName');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName');
    itSubmitsNewValue('lastName');
    
  });
  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
   // itSubmitsExistingValue('phoneNumber');
   // itSubmitsNewValue('phoneNumber');
    
  });
  
  it('has a submit button', () => {
    renderWithStore(<CustomerForm  {...validCustomer}/>);
    const submitButton = element(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  it('dispatches ADD_CUSTOMER_REQUEST when submitting data', async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'ADD_CUSTOMER_REQUEST',
        customer: validCustomer
    });
  });
/*  
 it('calls fetch with the right properties when submitting data', async () => {
  //  const fetchSpy = spy(); fetch={fetchSpy.fn}
  renderWithStore(
      <CustomerForm  
      {...validCustomer}
     />
    );
    submit(form('customer'));
   // ReactTestUtils.Simulate.submit(form('customer'));

    expect( window.fetch).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
    }));
  }); */
    /*   expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual('/customers');
  
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(fetchOpts.method).toEqual('POST');
    expect(fetchOpts.credentials).toEqual('same-origin');
    expect(fetchOpts.headers).toEqual({
      'Content-Type': 'application/json'
    }); */

/*   it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn(); //spy();
  
    renderWithStore(<CustomerForm 
      {...validCustomer}
        onSave={saveSpy} 
        />);
    await act(async () => {
      submit(form('customer'));
     // ReactTestUtils.Simulate.submit(form('customer'));
    });
  
    expect(saveSpy).toHaveBeenCalledWith(customer);
  //   expect(saveSpy).toHaveBeenCalled();
   // expect(saveSpy.receivedArgument(0)).toEqual(customer); 
  }); */

/* it('does not notify onSave if the POST request returns an error', async () => {
     window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn(); // spy();
  
    renderWithStore(<CustomerForm 
      {...validCustomer}
      onSave={saveSpy} 
      />);
    await act(async () => {
      submit(form('customer'));
     // ReactTestUtils.Simulate.submit(form('customer'));
    });
  
    expect(saveSpy).not.toHaveBeenCalled();
  }); 
  */

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn(); // spy();
  
    renderWithStore(<CustomerForm  {...validCustomer}/>);
    await act(async () => {
      submit(form('customer'),{
        preventDefault: preventDefaultSpy
        //preventDefault: preventDefaultSpy.fn
      });
    /* ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy
        //preventDefault: preventDefaultSpy.fn
      });*/
    });
  
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when error prop is true', () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({ type: 'ADD_CUSTOMER_FAILED' });
    expect(element('.error').textContent).toMatch('error occurred');
  });
 /*  it('renders error message when fetch call fails', async () => {
     window.fetch.mockReturnValue(Promise.resolve({ ok: false }));
  
     renderWithStore(<CustomerForm {...validCustomer}/>);
    await act(async () => {
      submit(form('customer'));
    //  ReactTestUtils.Simulate.submit(form('customer'));
    });
  
    const errorElement = element('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  }); */

  describe('validation form', () => {

    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        renderWithStore(<CustomerForm />);
    
        blur(
          field('customer', fieldName),
          withEvent(fieldName, value)
        );
    
        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(
          description
        );
      });
    }

    itInvalidatesFieldWithValue('firstName','','First name is required');
    itInvalidatesFieldWithValue('lastName','','Last name is required');
    itInvalidatesFieldWithValue(
      'phoneNumber',
      ' ',
      'Phone number is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    it('accepts standard phone number characters when validating', () => {
      renderWithStore(<CustomerForm />);
    
      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber', '0123456789+()- ')
      );
    
      expect(element('.error')).toBeNull();
    });

    it('does not submit the form when there are validation errors', async () => {
      renderWithStore(<CustomerForm />);
    
      await submit(form('customer'));
      return expectRedux(store)
        .toNotDispatchAnAction(100)
        .ofType('ADD_CUSTOMER_REQUEST');
    });
/*     it('does not submit the form when there are validation errors', async () => {
      renderWithStore(<CustomerForm />);
    
      await submit(form('customer'));
      expect(window.fetch).not.toHaveBeenCalled();
    }); */
    it('renders validation errors after submission fails', async () => {
      renderWithStore(<CustomerForm />);
      await submit(form('customer'));
      expect(window.fetch).not.toHaveBeenCalled();
      expect(element('.error')).not.toBeNull();
    });

    it('renders field validation errors from server', () => {
      const errors = {
        phoneNumber: 'Phone number already exists in the system'
      };
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({
        type: 'ADD_CUSTOMER_VALIDATION_FAILED',
        validationErrors: errors
      });
      expect(element('.error').textContent).toMatch(
        errors.phoneNumber
      );
    });
/*     it('renders field validation errors from server', async () => {
      const errors = {
        phoneNumber: 'Phone number already exists in the system'
      };
      window.fetch.mockReturnValue(
        fetchResponseError(422, { errors })
      );
      renderWithStore(<CustomerForm {...validCustomer} />);
      await submit(form('customer'));
      expect(element('.error').textContent).toMatch(
        errors.phoneNumber
      );
    }); */

    it('displays indicator when form is submitting', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
      expect(element('.submittingIndicator')).not.toBeNull();
    });

/*     it('displays indicator when form is submitting', async () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async() => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    }); */
    
    it('initially does not display the submitting indicator', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
    });

    it('hides indicator when form has submitted', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUCCESSFUL' });
      expect(element('.submittingIndicator')).toBeNull();
    });

/*      it('hides indicator when form has submitted', async () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      await submit(form('customer'));
      expect(element('.submittingIndicator')).toBeNull();
    });  */

    it('disables the submit button when submitting', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
      //expect(element('.submittingIndicator')).not.toBeNull();
      //console.log(element('input[type="submit"]'));
      expect(element('input[type="submit"]').hasAttribute('disabled')).toBeFalsy();
    });

  })

  

});

