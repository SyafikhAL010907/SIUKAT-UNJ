import { ukt } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_UKT',
        payload: ukt.getByLoggedIn(token)
    };
}
