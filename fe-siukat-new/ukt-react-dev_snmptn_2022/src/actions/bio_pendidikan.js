import { bio_pendidikan } from '../api';

export function fetchForPendidikan() {
    return {
        type: 'FETCH_BIO_PENDIDIKAN',
        payload: bio_pendidikan.fetchBioPendidikan(),
    };
}
