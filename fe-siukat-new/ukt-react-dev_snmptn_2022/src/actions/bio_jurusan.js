import { bio_jurusan } from '../api';

export function fetchForJurusan() {
    return {
        type: 'FETCH_BIO_JURUSAN',
        payload: bio_jurusan.fetchBioJurusan(),
    };
}
