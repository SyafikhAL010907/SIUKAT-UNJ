import { bio_kabkot } from '../api';

export function fetchForBioCmahasiswa(id) {
    return {
        type: 'FETCH_BIO_KABKOT_MHS',
        payload: bio_kabkot.fetchBioKabkot(id),
    };
}

export function fetchForBioOrangtua(id) {
    return {
        type: 'FETCH_BIO_KABKOT_ORANGTUA',
        payload: bio_kabkot.fetchBioKabkot(id),
    };
}
