export default function reducer(
  state = {
    ibu: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_IBU": {
      return { ...state, fetching: true };
    }
    case "FETCH_IBU_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_IBU_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        ibu: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
