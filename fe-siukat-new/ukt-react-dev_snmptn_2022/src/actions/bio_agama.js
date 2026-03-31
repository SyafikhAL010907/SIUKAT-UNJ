import { bio_agama } from '../api';

export function fetchForBioCmahasiswa(id) {
    return {
        type: 'FETCH_BIO_AGAMA_MHS',
        payload: bio_agama.fetchBioAgama(id),
    };
}
