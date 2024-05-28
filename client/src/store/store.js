// store.ts

import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers/reducers";
import { loadState, saveState } from "../middleware/sessionStorage";

const persistedState = loadState();

const store = createStore(rootReducer, persistedState, applyMiddleware(thunk));

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
