export default function reducer(
  state = {
    loading: false,
    fields: [],
    startDates: [],
    endDates: [],
    meta: {
      data: [],
    },
  },
  action,
) {
  switch (action.type) {
    case "FETCH_DASHBOARD_DATA": {
      return {
        ...state,
        loading: true,
      };
    }
    case "FETCH_DASHBOARD_DATA_FULFILLED": {
      return {
        ...state,
        loading: false,
        fields: action.payload.fields,
        startDates: action.payload.startDates,
        endDates: action.payload.endDates,
      };
    }
    case "FETCH_DASHBOARD_META": {
      return {
        ...state,
        loading: true,
      };
    }
    case "FETCH_DASHBOARD_META_FULFILLED": {
      return {
        ...state,
        loading: false,
        meta: {
          data: action.payload,
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
