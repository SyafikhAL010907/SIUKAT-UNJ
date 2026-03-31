export default function reducer(
    state = {
        bio_agama_cmahasiswa: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_AGAMA_MHS': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_AGAMA_MHS_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_AGAMA_MHS_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_agama_cmahasiswa: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
