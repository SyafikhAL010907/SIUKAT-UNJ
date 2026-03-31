export default function reducer(
    state = {
        bio_kabkot_cmahasiswa: {},
        bio_kabkot_orangtua: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_KABKOT_MHS': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_KABKOT_MHS_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_KABKOT_MHS_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_kabkot_cmahasiswa: action.payload,
        };
    }
    case 'FETCH_BIO_KABKOT_ORANGTUA': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_KABKOT_ORANGTUA_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_KABKOT_ORANGTUA_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_kabkot_orangtua: action.payload,
        };
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
