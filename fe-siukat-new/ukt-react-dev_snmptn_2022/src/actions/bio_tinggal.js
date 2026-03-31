import { bio_tinggal } from '../api';

export function fetchForBioCmahasiswa(id) {
    return {
        type: 'FETCH_BIO_TINGGAL_MHS',
        payload: bio_tinggal.fetchBioTinggal(id),
    };
}
