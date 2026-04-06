import { user } from '../api'

export function getByLoggedIn(token){
    return {
        type: "FETCH_USER",
        payload: user.getByLoggedIn(token)
    }
}
