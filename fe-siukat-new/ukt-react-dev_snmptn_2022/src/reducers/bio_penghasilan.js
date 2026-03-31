export default function reducer(
    state = {
        bio_penghasilan: {},
        bio_penghasilan_ayah: {},
        bio_penghasilan_ibu: {},
        bio_penghasilan_wali: {},
        fetching: false,
        fetched: false,
        error: null,
    },
    action
) {
    switch (action.type) {
    case 'FETCH_BIO_PENGHASILAN': {
        return { ...state, fetching: true };
    }
    case 'FETCH_BIO_PENGHASILAN_REJECTED': {
        return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCH_BIO_PENGHASILAN_FULFILLED': {
        return {
            ...state,
            fetching: false,
            fetched: true,
            bio_penghasilan: action.payload,
        };
    }

    default: {
        return {
            ...state,
        };
    }
    }
}
