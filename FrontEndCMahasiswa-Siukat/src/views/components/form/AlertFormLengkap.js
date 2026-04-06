import React from 'react';
import { Alert } from 'reactstrap';

let AlertFormLengkap = (props) => {
    return(
        <Alert color="success">
            <i className="fa fa-check"></i> Pengisian sudah lengkap. Silakan periksa kembali data yang Anda masukkan pada menu <b>"VERIFIKASI"</b>!
        </Alert>
    );
};

let AlertFormBelumLengkap = (props) => {
    return(
        <Alert color="warning">
            <i className="fa fa-info-circle"></i> Pengisian belum lengkap. Mohon segera dilengkapi! Jangan lupa klik <b>"SIMPAN"</b> agar data tersimpan!
        </Alert>
    );
};

export {
    AlertFormLengkap,
    AlertFormBelumLengkap,
}; 