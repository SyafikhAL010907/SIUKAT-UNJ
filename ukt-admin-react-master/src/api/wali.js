import axios from "axios"
import { service, notif, errLog } from "../global"

export function getById(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service + "/wali/get-wali/"+id, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response),"error")            
            resolve(err)
        })
    })
}

export function updateData(token, input, id){
    return new Promise((resolve, reject) => {
        axios.put(service+'/wali/edit/'+id, input, {
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
