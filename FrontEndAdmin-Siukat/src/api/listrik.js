import axios from 'axios'
import { service, notif, errLog } from '../global'

export function getById(token, id, atribut = ""){
    let url = service+'/listrik/get-listrik/'+id;
    if (atribut) url += '?atribut=' + atribut;
    return new Promise((resolve, reject) => {
        axios.get(url, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}

export function updateData(token, input, id){
    return new Promise((resolve, reject) => {
        axios.put(service+'/listrik/edit/'+id, input, {
                headers: {
                    "Authorization": "Bearer "+token,
                    "Content-Type": "multipart/form-data",
                }
            })
            .then((response) => {
                notif("Berhasil!", "Data berhasil tersimpan", "success")                
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}
