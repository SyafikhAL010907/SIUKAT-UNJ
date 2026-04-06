import axios from 'axios'
import { service, notif, errLog, dateConverter } from '../global'

export function getById(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/ibu/get-ibu/'+id, {
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