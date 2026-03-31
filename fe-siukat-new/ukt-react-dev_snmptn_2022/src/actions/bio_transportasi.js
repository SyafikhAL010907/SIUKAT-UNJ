import { bio_transportasi } from '../api';

export function fetchForBioCmahasiswa(id) {
    return {
        type: 'FETCH_BIO_TRANSPORTASI_MHS',
        payload: bio_transportasi.fetchBioTransportasi(id),
    };
}
