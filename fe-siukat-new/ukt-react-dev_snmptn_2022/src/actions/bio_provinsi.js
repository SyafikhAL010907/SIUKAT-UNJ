import { bio_provinsi } from '../api';

export function fetchBioProvinsi() {
    return {
        type: 'FETCH_BIO_PROVINSI',
        payload: bio_provinsi.fetchBioProvinsi(),
    };
}
