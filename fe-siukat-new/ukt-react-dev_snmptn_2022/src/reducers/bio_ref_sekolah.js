export default function reducer(
    state = {
        bio_ref_sekolah: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_REF_SEKOLAH': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_REF_SEKOLAH_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_REF_SEKOLAH_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_ref_sekolah: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
