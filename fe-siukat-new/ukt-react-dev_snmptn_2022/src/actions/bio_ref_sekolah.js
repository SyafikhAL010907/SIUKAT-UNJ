import { bio_ref_sekolah } from '../api';

export function fetchForRefSekolah() {
    return {
        type: 'FETCH_BIO_REF_SEKOLAH',
        payload: bio_ref_sekolah.fetchBioRefSekolah(),
    };
}
