export default function reducer(state={
    kecamatan_cmahasiswa: [],
    kecamatan_ayah: [],
    kecamatan_ibu: [],
    kecamatan_wali: [],
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
    case 'FETCH_KECAMATAN_MHS': {
        return {...state, fetching: true};
    }
    case 'FETCH_KECAMATAN_MHS_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KECAMATAN_MHS_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kecamatan_cmahasiswa: action.payload
        };
    }
    case 'FETCH_KECAMATAN_AYAH': {
        return {...state, fetching: true};
    }
    case 'FETCH_KECAMATAN_AYAH_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KECAMATAN_AYAH_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kecamatan_ayah: action.payload
        };
    }
    case 'FETCH_KECAMATAN_IBU': {
        return {...state, fetching: true};
    }
    case 'FETCH_KECAMATAN_IBU_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KECAMATAN_IBU_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kecamatan_ibu: action.payload
        };
    }
    case 'FETCH_KECAMATAN_WALI': {
        return {...state, fetching: true};
    }
    case 'FETCH_KECAMATAN_WALI_REJECTED': {
        return {...state, fetching: false, error: action.payload};
    }
    case 'FETCH_KECAMATAN_WALI_FULFILLED': {
        return {
            ...state, 
            fetching: false,
            fetched: true,
            kecamatan_wali: action.payload
        };
    }
    default: {
        return {
            ...state
        };
    }
    }
}