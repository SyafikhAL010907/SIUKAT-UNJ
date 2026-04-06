import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchCmahasiswa(token, pageKeyword){
    return new Promise((resolve, reject) => {
        axios.post(service+'/cmahasiswa/datatable', pageKeyword, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err), "error")
                reject(err.response)
            })
    })
}

export function fetchKlarifikasi(token, pageKeyword){
    return new Promise((resolve, reject) => {
        axios.post(service+'/cmahasiswa/datatable-sanggah', pageKeyword, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err), "error")
                reject(err.response)
            })
    })
}
export function getById(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/cmahasiswa/no-peserta/'+id, {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err), "error")
                reject(err.response)
            })
    })
}
export function updateData(token, input, id){
    return new Promise((resolve, reject) => {
        axios.put(service+'/cmahasiswa/edit/'+id, input, {
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
export function flagCount(token){
    return new Promise((resolve, reject) => {
        axios.get(service+'/cmahasiswa/count-flag', {
                headers: {
                    "Authorization": "Bearer "+token
                }
            })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err), "error")
                reject(err.response)
            })
    })
}
export function flagSelesaiKlarifikasi(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/cmahasiswa/flag-selesai-klarifikasi/'+id, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            notif("Berhasil!", "Calon Mahasiswa telah menyelesaikan proses klarifikasi", "success")
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err), "error")
            reject(err.response)
        })
    })
}
export function flagBatalKlarifikasi(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/cmahasiswa/flag-batal-klarifikasi/'+id, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            notif("Berhasil!", "Klarifikasi telah dibatalkan", "success")
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err), "error")
            reject(err.response)
        })
    })
}