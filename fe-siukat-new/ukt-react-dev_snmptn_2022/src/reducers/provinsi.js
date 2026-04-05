export default function reducer(state={
    provinsi: [],
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
    case 'FETCH_PROVINSI': {
        return {...state, fetching: true};
    }
    case 'FETCH_PROVINSI_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_PROVINSI_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            provinsi: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}