import { storeSpy, expectRedux } from 'expect-redux';
import { configureStore } from '../../src/store';
import { reducer } from '../../src/sagas/customer';
import 'whatwg-fetch';
import { 
    fetchResponseOk,
    fetchResponseError
   } from '../spyHelpers';
import { 
       itMaintainsExistingState,
       itSetsStatus  
    } from '../reducerGenerators';


describe('addCustomer', () => {
  let store;
  const customer = { id: 123 };

  beforeEach(() => {
    //jest.spyOn(window, 'fetch');
    jest.spyOn(window, 'fetch')
    .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([ storeSpy ]);
  });

  const dispatchRequest = customer =>
  store.dispatch({
    type: 'ADD_CUSTOMER_REQUEST',
    customer
  });

 it('sets current status to submitting', () => {
    dispatchRequest();

    return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'ADD_CUSTOMER_SUBMITTING' });
    });
it('submits request to the fetch api', async () => {
        const inputCustomer = { firstName: 'Ashley' };
        dispatchRequest(inputCustomer);
      
        expect(window.fetch).toHaveBeenCalledWith('/customers', {
          body: JSON.stringify(inputCustomer),
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }
        });
      });

it('dispatches ADD_CUSTOMER_SUCCESSFUL on success', () => {
        dispatchRequest();
      
        return expectRedux(store)
          .toDispatchAnAction()
          .matching({ type: 'ADD_CUSTOMER_SUCCESSFUL', customer });
      });
 it('dispatches ADD_CUSTOMER_FAILED on non-specific error', () => {
        window.fetch.mockReturnValue(fetchResponseError());
        dispatchRequest();
      
        return expectRedux(store)
          .toDispatchAnAction()
          .matching({ type: 'ADD_CUSTOMER_FAILED' });
      });

it('dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned', () => {
        const errors = { field: 'field', description: 'error text' };
        window.fetch.mockReturnValue(
          fetchResponseError(422, { errors })
        );
      
        dispatchRequest();
      
        return expectRedux(store)
          .toDispatchAnAction()
          .matching({
            type: 'ADD_CUSTOMER_VALIDATION_FAILED',
            validationErrors: errors
          });
      });
});

describe('reducer', () => {
    it('returns a default state for an undefined existing state', () => {
      expect(reducer(undefined, {})).toEqual({
        customer: {},
        status: undefined,
        validationErrors: {},
        error: false
      });
    });

    describe('ADD_CUSTOMER_SUBMITTING action', () => {
        const action = { type: 'ADD_CUSTOMER_SUBMITTING' };
      
        itSetsStatus(reducer, action, 'SUBMITTING');

/*         it('sets status to SUBMITTING', () => {
          expect(reducer(undefined, action)).toMatchObject({
            status: 'SUBMITTING'
          });
        }); */
        itMaintainsExistingState(reducer, action);
/*         it('maintains existing state', () => {
            expect(reducer({ a: 123 }, action)).toMatchObject({
              a: 123
            });
          }); */

      });

      describe('ADD_CUSTOMER_FAILED action', () => {
        const action = { type: 'ADD_CUSTOMER_FAILED' };
      
        itSetsStatus(reducer, action, 'FAILED');
/*         it('sets status to FAILED', () => {
          expect(reducer(undefined, action)).toMatchObject({
            status: 'FAILED'
          });
        }); */
      
        itMaintainsExistingState(reducer, action);

        it('sets error to true', () => {
            expect(reducer(undefined, action)).toMatchObject({
              error: true
            });
          });
      });

      describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
        const validationErrors = { field: "error text" };
        const action = {
          type: 'ADD_CUSTOMER_VALIDATION_FAILED',
          validationErrors
        };
      
        it('sets status to VALIDATION_FAILED', () => {
          expect(reducer(undefined, action)).toMatchObject({
            status: 'VALIDATION_FAILED'
          });
        });
      
        it('maintains existing state', () => {
          expect(reducer({ a: 123 }, action)).toMatchObject({
            a: 123
          });
        });
        it('sets validation errors to provided errors', () => {
            expect(reducer(undefined, action)).toMatchObject({
              validationErrors
            });
          });
      });

      describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
        const customer = { id: 123 };
        const action = {
          type: 'ADD_CUSTOMER_SUCCESSFUL',
          customer
        };
      
        itSetsStatus(reducer, action, 'SUCCESSFUL');
/*         it('sets status to SUCCESSFUL', () => {
          expect(reducer(undefined, action)).toMatchObject({
            status: 'SUCCESSFUL'
          });
        }); */
      
        itMaintainsExistingState(reducer, action);
/*         it('maintains existing state', () => {
          expect(reducer({ a: 123 }, action)).toMatchObject({
            a: 123
          });
        });
 */
        it('sets customer to provided customer', () => {
            expect(reducer(undefined, action)).toMatchObject({
              customer
            });
          });

      });
  });