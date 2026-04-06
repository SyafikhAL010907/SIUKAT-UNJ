import { rumah } from '../api'

export function getById(token, id){
    return {
        type: "FETCH_RUMAH",
        payload: rumah.getById(token, id)
    }
}

export function updateData(token, input, id){
    return {
        type: "FETCH_RUMAH",
        payload: rumah.updateData(token, input, id).then((response) => {
            return rumah.getById(token, id)
        })
    }
}