export default function reducer(
    state = {
        bio_kecamatan_cmahasiswa: {},
        bio_kecamatan_orangtua: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_KECAMATAN_MHS': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_KECAMATAN_MHS_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_KECAMATAN_MHS_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_kecamatan_cmahasiswa: action.payload,
        };
    }
    case 'FETCH_BIO_KECAMATAN_ORANGTUA': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_KECAMATAN_ORANGTUA_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_KECAMATAN_ORANGTUA_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_kecamatan_orangtua: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
