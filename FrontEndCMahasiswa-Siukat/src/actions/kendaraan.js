import { kendaraan } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_KENDARAAN',
        payload: kendaraan.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_KENDARAAN',
        payload: kendaraan.updateData(token, input).then((response) => {
            return kendaraan.getByLoggedIn(token);
        })
    };
}