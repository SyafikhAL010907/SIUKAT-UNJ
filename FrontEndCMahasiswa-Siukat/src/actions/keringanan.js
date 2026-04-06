import { keringanan } from '../api';

export function updateData(token, input) {
    return {
        type: 'FETCH_KERINGANAN',
        payload: keringanan.updateData(token, input).then((response) => {
            return keringanan.getData(token);
        })
    };
}

export function getData(token) {
    return {
        type: 'FETCH_KERINGANAN',
        payload: keringanan.getData(token),
    };
}
