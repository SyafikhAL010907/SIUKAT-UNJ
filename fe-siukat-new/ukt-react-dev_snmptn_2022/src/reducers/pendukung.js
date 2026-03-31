export default function reducer(state={
    pendukung: {},
    fetching: false,
    fetched: false,
    error: null,
}, action){
    switch(action.type){
    case 'FETCH_PENDUKUNG': {
        return {...state, fetching: true};
    }
    case 'FETCH_PENDUKUNG_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_PENDUKUNG_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            pendukung: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}