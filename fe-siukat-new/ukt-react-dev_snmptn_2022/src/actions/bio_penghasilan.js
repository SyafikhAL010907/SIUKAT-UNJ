import { bio_penghasilan } from '../api';

export function fetchForPenghasilan() {
    return {
        type: 'FETCH_BIO_PENGHASILAN',
        payload: bio_penghasilan.fetchBioPenghasilan(),
    };
}
