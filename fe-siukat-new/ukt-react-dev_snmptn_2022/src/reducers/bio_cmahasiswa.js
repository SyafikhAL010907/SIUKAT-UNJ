export default function reducer(
    state = {
        bio_cmahasiswa: {},
        bio_verifikasi: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_CMAHASISWA': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_CMAHASISWA_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_CMAHASISWA_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_cmahasiswa: action.payload,
        };
    }
    case 'FETCH_BIO_VERIFIKASI': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_VERIFIKASI_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_VERIFIKASI_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_verifikasi: action.payload,
        };
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
