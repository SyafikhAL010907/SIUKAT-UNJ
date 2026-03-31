import { bio_pekerjaan } from '../api';

export function fetchForPekerjaan() {
    return {
        type: 'FETCH_BIO_PEKERJAAN',
        payload: bio_pekerjaan.fetchBioPekerjaan(),
    };
}
