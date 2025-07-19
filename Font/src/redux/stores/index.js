import { createStore, combineReducers,applyMiddleware } from 'redux';
import loadingReducers from '../reducers/loadingReducer';
import CartReducers from '../reducers/cartReducers';
import {thunk} from "redux-thunk";
// import { createStore, applyMiddleware, combineReducers } from "redux";
const rootReducer = combineReducers({
    loading: loadingReducers,
    // thêm reducer khác nếu có
    cart : CartReducers
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;