import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchCaptcha(){
    return new Promise((resolve, reject) => {
        axios.get(service+'/captcha')
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                reject(err.response)
            })
    })
}