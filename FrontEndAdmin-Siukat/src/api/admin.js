import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchAdmin(token, pageKeyword){
    return new Promise((resolve, reject) => {
        axios.post(service+'/admin/datatable', pageKeyword, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                reject(err.response)
            })
    })
}
export function getById(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/admin/username/'+id, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                reject(err.response)
            })
    })
}
export function save(token, input){
    return new Promise((resolve, reject) => {
        axios.post(service+'/admin/save', input, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                notif("Berhasil!", "Data berhasil dimasukkan", "success")
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                reject(err.response)
            })
    })
}
export function deleteById(token, username){
    return new Promise((resolve, reject) => {
        axios.delete(service+'/admin/delete/'+username, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                notif("Berhasil!", "Data berhasil dihapus", "success")
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                reject(err.response)
            })
    })
}