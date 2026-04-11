import axios from 'axios'
import { service, notif, errLog, dateConverter } from '../global'

export function getById(token, id, atribut = ""){
    let url = service+'/ibu/get-ibu/'+id;
    if (atribut) url += '?atribut=' + atribut;
    return new Promise((resolve, reject) => {
        axios.get(url, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                response.data.tanggal_lahir_ibu = dateConverter(response.data.tanggal_lahir_ibu)
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
        axios.put(service+'/ibu/edit/'+id, input, {
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