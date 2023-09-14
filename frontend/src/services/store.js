import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension'

// import taskReducer from "./Reducers/taskReducer";
// import userReducer from "./Reducers/userReducer";
import rootReducer from "./Reducers";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;