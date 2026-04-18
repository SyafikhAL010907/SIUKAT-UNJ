export default function reducer(
  state = {
    admin: {
      rows: [],
      count: null,
      totalPages: null,
      currentPage: 1,
      perPage: 10,
      keyword: "",
    },
    helloguys: "hello",
    singleAdmin: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_ADMIN": {
      return { ...state, fetching: true };
    }
    case "FETCH_ADMIN_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_ADMIN_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        admin: {
          rows: action.payload.rows,
          count: action.payload.count,
          totalPages: Math.ceil(action.payload.count / action.payload.perPage),
          currentPage: action.payload.currentPage,
          perPage: action.payload.perPage,
          keyword: action.payload.keyword,
        },
      };
    }
    case "FETCH_SINGLE_ADMIN": {
      return { ...state, fetching: true };
    }
    case "FETCH_SINGLE_ADMIN_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_SINGLE_ADMIN_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        singleAdmin: {
          ...action.payload,
          username_lama: action.payload.username,
        },
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
