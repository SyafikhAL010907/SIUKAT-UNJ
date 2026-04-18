export default function reducer(
  state = {
    pekerjaan: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_PEKERJAAN": {
      return { ...state, fetching: true };
    }
    case "FETCH_PEKERJAAN_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_PEKERJAAN_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        pekerjaan: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
