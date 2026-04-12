import { info } from '../api';

export function fetchInfo(kode){
    return {
        type: 'FETCH_INFO',
        payload: info.fetchInfo(kode)
    };
}