export default function reducer(state={
    cmahasiswa: {},
    verifikasi: {},
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
    case 'FETCH_CMAHASISWA': {
        return {...state, fetching: true};
    }
    case 'FETCH_CMAHASISWA_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_CMAHASISWA_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            cmahasiswa: action.payload
        };
    }
    case 'FETCH_VERIFIKASI': {
        return {...state, fetching: true};
    }
    case 'FETCH_VERIFIKASI_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_VERIFIKASI_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            verifikasi: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}