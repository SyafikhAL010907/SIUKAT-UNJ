import { pendukung } from '../api'

export function getById(token, id){
    return {
        type: "FETCH_PENDUKUNG",
        payload: pendukung.getById(token, id)
    }
}

export function updateData(token, input, id){
    return {
        type: "FETCH_PENDUKUNG",
        payload: pendukung.updateData(token, input, id).then((response) => {
            return pendukung.getById(token, id)
        })
    }
}