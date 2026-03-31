export default function reducer(
    state = {
        bio_sekolah_cmahasiswa: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_SEKOLAH_CMAHASISWA': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_SEKOLAH_CMAHASISWA_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_SEKOLAH_CMAHASISWA_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_sekolah_cmahasiswa: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
