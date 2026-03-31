import { listrik } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_LISTRIK',
        payload: listrik.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_LISTRIK',
        payload: listrik.updateData(token, input).then((response) => {
            return listrik.getByLoggedIn(token);
        })
    };
}