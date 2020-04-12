import { 
    createStore, 
    applyMiddleware,
    combineReducers, 
    compose 
  } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest } from "redux-saga/effects";
import { 
    addCustomer,
    reducer as customerReducer 
} from './sagas/customer';
import { reducer as appointmentReducer }
  from '../src/reducer/appointment';
import { customerAdded } from './sagas/app';
import {
  queryCustomer,
  reducer as queryCustomerReducer
} from './sagas/queryCustomer';

function* rootSaga() {
    yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
    yield takeLatest('ADD_CUSTOMER_SUCCESSFUL', customerAdded);
    yield takeLatest('QUERY_CUSTOMER_REQUEST', queryCustomer);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
   // (state, _) => state,
    combineReducers({ 
      customer: customerReducer,
      appoinment: appointmentReducer,
      queryCustomer: queryCustomerReducer 
    }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    )
  );
  sagaMiddleware.run(rootSaga);

  return store;
};

