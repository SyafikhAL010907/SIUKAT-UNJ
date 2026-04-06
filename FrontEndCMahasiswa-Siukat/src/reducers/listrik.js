export default function reducer(state={
    listrik: {},
    fetching: false,
    fetched: false,
    error: null,
}, action){
    switch(action.type){
    case 'FETCH_LISTRIK': {
        return {...state, fetching: true};
    }
    case 'FETCH_LISTRIK_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_LISTRIK_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            listrik: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}