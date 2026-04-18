export default function reducer(
  state = {
    wali: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_WALI": {
      return { ...state, fetching: true };
    }
    case "FETCH_WALI_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_WALI_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        wali: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
