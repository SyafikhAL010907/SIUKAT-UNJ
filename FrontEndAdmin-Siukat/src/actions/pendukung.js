import { pendukung } from '../api'

export function getById(token, id, atribut = ""){
    return {
        type: "FETCH_PENDUKUNG",
        payload: pendukung.getById(token, id, atribut)
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