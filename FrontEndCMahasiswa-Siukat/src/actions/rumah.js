import { rumah } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_RUMAH',
        payload: rumah.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_RUMAH',
        payload: rumah.updateData(token, input).then((response) => {
            return rumah.getByLoggedIn(token);
        })
    };
}