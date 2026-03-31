export default function reducer(
    state = {
        bio_pekerjaan: {},
        bio_pekerjaan_ayah: {},
        bio_pekerjaan_ibu: {},
        bio_pekerjaan_wali: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_PEKERJAAN': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_PEKERJAAN_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_PEKERJAAN_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_pekerjaan: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
