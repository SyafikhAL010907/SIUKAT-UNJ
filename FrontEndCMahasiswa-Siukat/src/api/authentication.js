import axios from 'axios';
import { service } from '../global';

export function login(req){
    return new Promise(function(resolve, reject){
        axios.post(service+'/users/login', {
            no_peserta: req.no_peserta,
            password: req.password,
            kode: req.kode_captcha,
            jawaban: req.jawaban
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err.response);
            });
    });
}