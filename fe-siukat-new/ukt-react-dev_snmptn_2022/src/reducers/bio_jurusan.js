export default function reducer(
    state = {
        bio_jurusan: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_JURUSAN': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_JURUSAN_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_JURUSAN_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_jurusan: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
