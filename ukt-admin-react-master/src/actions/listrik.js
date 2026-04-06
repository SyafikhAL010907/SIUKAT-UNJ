import { listrik } from '../api'

export function getById(token, id){
    return {
        type: "FETCH_LISTRIK",
        payload: listrik.getById(token, id)
    }
}

export function updateData(token, input, id){
    return {
        type: "FETCH_LISTRIK",
        payload: listrik.updateData(token, input, id).then((response) => {
            return listrik.getById(token, id)
        })
    }
}