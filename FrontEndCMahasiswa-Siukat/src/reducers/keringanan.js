export default function reducer(state = {
    keringanan: {},
    fetching: false,
    fetched: false,
    error: null
}, action) {
    switch (action.type) {
        case 'FETCH_KERINGANAN': {
            return { ...state, fetching: true };
        }
        case 'FETCH_KERINGANAN_REJECTED': {
            return { ...state, fetching: false, error: action.payload };
        }
        case 'FETCH_KERINGANAN_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                keringanan: action.payload
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}