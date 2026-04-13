import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchDataFakultas(token, tahun, jalur) {
    const queryParams = [];
    if (tahun) queryParams.push(`tahun=${tahun}`);
    if (jalur) queryParams.push(`jalur=${jalur}`);
    queryParams.push(Math.random() * 100);

    return new Promise((resolve, reject) => {
        const url = `${service}/summary/fakultas?${queryParams.join('&')}`;
        axios.get(url, {
            headers: {
                "Authorization": "Bearer " + token
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

export function fetchDataProdi(token, tahun, jalur) {
    const queryParams = [];
    if (tahun) queryParams.push(`tahun=${tahun}`);
    if (jalur) queryParams.push(`jalur=${jalur}`);
    queryParams.push(Math.random() * 100);

    return new Promise((resolve, reject) => {
        const url = `${service}/summary/prodi?${queryParams.join('&')}`;
        axios.get(url, {
            headers: {
                "Authorization": "Bearer " + token
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