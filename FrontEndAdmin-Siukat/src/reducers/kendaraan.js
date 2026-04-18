export default function reducer(
  state = {
    kendaraan: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_KENDARAAN": {
      return { ...state, fetching: true };
    }
    case "FETCH_KENDARAAN_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_KENDARAAN_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        kendaraan: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
