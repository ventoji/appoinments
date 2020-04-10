import ReactDOM from 'react-dom';
import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { storeSpy } from 'expect-redux';
import { configureStore } from '../src/store';

export const withEvent = (name, value) => ({
  target: { name, value }
});

export const createContainer = () => {
  const container = document.createElement('div');

  const form = id =>
      container.querySelector(`form[id="${id}"]`);
  
  const field = (formId, name) => form(formId).elements[name];
  
  const labelFor = formElement =>
      container.querySelector(`label[for="${formElement}"]`);
  
  const element = selector =>
      container.querySelector(selector);
  
  const elements = selector =>
  Array.from(container.querySelectorAll(selector));

  const simulateEvent = eventName => (element, eventData) =>
  ReactTestUtils.Simulate[eventName](element, eventData);

const simulateEventAndWait = eventName => async (
  element,
  eventData
) =>
  await act(async () =>
    ReactTestUtils.Simulate[eventName](element, eventData)
  );

  return {
    render: component =>
    act(() => {
      ReactDOM.render(component, container);
    }),
    renderAndWait: async component =>
      await act(async () => ReactDOM.render(component, container)), 
    container,
    element,
    form,
    field,
    labelFor,
    elements,
    click: simulateEvent('click'),
    clickAndWait: simulateEventAndWait('click'),
    change: simulateEvent('change'),
    changeAndWait: simulateEventAndWait('change'),
    submit: simulateEventAndWait('submit'),
    blur: simulateEvent('blur')
  };
};

export const createContainerWithStore = () => {
  const store = configureStore([storeSpy]);

  const container = createContainer();
  return {
    ...container,
    store,
    renderWithStore: component => {
      act(() => {
        ReactDOM.render(
          <Provider store={store}>{component}</Provider>,
          container.container
        );
      });
    }
  };
};