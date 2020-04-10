import { 
    createStore, 
    applyMiddleware,
    combineReducers, 
    compose } 
    from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest } from "redux-saga/effects";
import { 
    addCustomer,
    reducer as customerReducer 
} from './sagas/customer';

function* rootSaga() {
    yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
   // (state, _) => state,
    combineReducers({ customer: customerReducer }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    )
  );
  sagaMiddleware.run(rootSaga);

  return store;
};

