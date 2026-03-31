export default function reducer(state={
    ukt: {},
    fetching: false,
    fetched: false,
    error: null,
}, action){
    switch(action.type){
    case 'FETCH_UKT': {
        return {...state, fetching: true};
    }
    case 'FETCH_UKT_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_UKT_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            ukt: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}