export default function reducer(
    state = {
        bio_ortu_cmahasiswa: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_ORTU_CMAHASISWA': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_ORTU_CMAHASISWA_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_ORTU_CMAHASISWA_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_ortu_cmahasiswa: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
