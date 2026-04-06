export default function reducer(state={
    info: {},
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
    case 'FETCH_INFO': {
        return {...state, fetching: true};
    }
    case 'FETCH_INFO_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_INFO_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            info: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}