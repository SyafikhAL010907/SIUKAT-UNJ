export default function reducer(
  state = {
    rumah: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_RUMAH": {
      return { ...state, fetching: true };
    }
    case "FETCH_RUMAH_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_RUMAH_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        rumah: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
