import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import { globalLoaderMiddleware } from "redux-global-loader";
// import { createLogger } from "redux-logger"
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import reducer from "./reducers";

const middleware = applyMiddleware(
  promise(),
  thunk,
  // createLogger(),
  promiseMiddleware(),
  globalLoaderMiddleware,
);

export default createStore(reducer, middleware);
