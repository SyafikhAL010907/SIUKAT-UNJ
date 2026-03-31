import { verifikasi } from '../api';

export function fetchVerifikasi(token){
    return {
        type: 'FETCH_VERIFIKASI',
        payload: verifikasi.fetchVerifikasi(token)
    };
}
