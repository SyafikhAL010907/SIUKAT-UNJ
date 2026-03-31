export default function reducer(
    state = {
        bio_provinsi: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_PROVINSI': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_PROVINSI_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_PROVINSI_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_provinsi: action.payload,
        };
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
