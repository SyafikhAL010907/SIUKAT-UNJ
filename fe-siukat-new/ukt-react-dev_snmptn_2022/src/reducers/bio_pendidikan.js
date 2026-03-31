export default function reducer(
    state = {
        bio_pendidikan: {},
        bio_pendidikan_ayah: {},
        bio_pendidikan_ibu: {},
        bio_pendidikan_wali: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_PENDIDIKAN': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_PENDIDIKAN_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_PENDIDIKAN_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_pendidikan: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
