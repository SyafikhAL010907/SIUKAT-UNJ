export default function reducer(state={
    kabkot_cmahasiswa: {},
    kabkot_ayah: {},
    kabkot_ibu: {},
    kabkot_wali: {},
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
    case 'FETCH_KABKOT_MHS': {
        return {...state, fetching: true};
    }
    case 'FETCH_KABKOT_MHS_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KABKOT_MHS_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kabkot_cmahasiswa: action.payload
        };
    }
    case 'FETCH_KABKOT_AYAH': {
        return {...state, fetching: true};
    }
    case 'FETCH_KABKOT_AYAH_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KABKOT_AYAH_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kabkot_ayah: action.payload
        };
    }
    case 'FETCH_KABKOT_IBU': {
        return {...state, fetching: true};
    }
    case 'FETCH_KABKOT_IBU_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KABKOT_IBU_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kabkot_ibu: action.payload
        };
    }
    case 'FETCH_KABKOT_WALI': {
        return {...state, fetching: true};
    }
    case 'FETCH_KABKOT_WALI_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KABKOT_WALI_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kabkot_wali: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}