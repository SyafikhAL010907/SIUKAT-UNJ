export default function reducer(
  state = {
    ayah: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_AYAH": {
      return { ...state, fetching: true };
    }
    case "FETCH_AYAH_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_AYAH_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        ayah: action.payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
