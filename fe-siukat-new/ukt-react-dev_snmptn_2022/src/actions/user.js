import { user } from '../api';

export function fetchUser(token){
    return {
        type: 'FETCH_USER',
        payload: user.fetchUser(token)
    };
}
