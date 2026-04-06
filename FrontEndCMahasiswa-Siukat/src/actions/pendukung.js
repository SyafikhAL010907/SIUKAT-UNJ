import { pendukung } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_PENDUKUNG',
        payload: pendukung.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_PENDUKUNG',
        payload: pendukung.updateData(token, input).then((response) => {
            return pendukung.getByLoggedIn(token);
        })
    };
}