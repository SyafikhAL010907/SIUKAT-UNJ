export default function reducer(
    state = {
        bio_tinggal_cmahasiswa: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_TINGGAL_MHS': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_TINGGAL_MHS_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_TINGGAL_MHS_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_tinggal_cmahasiswa: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
