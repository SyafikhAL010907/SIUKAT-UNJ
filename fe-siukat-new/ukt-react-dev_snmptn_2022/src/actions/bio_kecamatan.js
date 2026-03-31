import { bio_kecamatan } from '../api';

export function fetchForBioCmahasiswa(id) {
    return {
        type: 'FETCH_BIO_KECAMATAN_MHS',
        payload: bio_kecamatan.fetchBioKecamatan(id),
    };
}

export function fetchForBioOrangTua(id) {
    return {
        type: 'FETCH_BIO_KECAMATAN_ORANGTUA',
        payload: bio_kecamatan.fetchBioKecamatan(id),
    };
}
