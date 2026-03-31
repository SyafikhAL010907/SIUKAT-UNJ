import { info } from '../api';

export function fetchInfo(){
    return {
        type: 'FETCH_INFO',
        payload: info.fetchInfo()
    };
}