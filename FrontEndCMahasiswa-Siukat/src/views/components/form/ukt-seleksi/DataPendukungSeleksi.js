import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText,
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { pendukung } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';

let FormPendukungSeleksi = (props) => {
    const { handleSubmit, pristine, submitting, scan_kk } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="tanggungan" col="12" xl="3" className="mb-2 mb-xl-0">
                    Jumlah Tanggungan
                </Label>
                <Col col="12" xl="9">
                    <Field
                        component={InputBs}
                        type="text"
                        name="tanggungan"
                        id="tanggungan"
                        placeholder="Jumlah Tanggungan"
                    />
                    <FormText color="muted">Termasuk Kepala Keluarga</FormText>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="file_scan_kk" col="12" xl="3" className="mb-2 mb-xl-0">
                    Kartu Keluarga
                </Label>
                <Col col="12" xl="6">
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_kk"
                        id="file_scan_kk"
                    />
                    <FormText color="muted">
                        <ul className="list-reset text-xs sm:text-sm">
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_kk && (
                    <Col col="12" xl="3" className="mt-2 mt-xl-0">
                        <a
                            href={
                                storage + '/' + scan_kk
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block py-2 text-sm"
                        >
                            <i className="fa fa-file mr-2"></i> Lihat KK
                        </a>
                    </Col>
                )}
            </FormGroup>

            <FormGroup row className="mt-5 border-top pt-4 mb-0">
                <Col col="12" xl="8">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col col="12" xl="4" className="mt-3 mt-xl-0">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 shadow-sm font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data Pendukung
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataPendukungSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var file = key.startsWith('file_scan') ? key : null;
            if (file) {
                formData.append(key, values[key][0]);
                document.getElementById(file).value = null;
            } else {
                let val = values[key];
                // Ekstraksi value jika berupa object
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    // Cek apakah ini Redux Form Field object
                    if (val.input || val.meta || (val.name && val.onChange)) {
                        val = "";
                    } else {
                        val = val.kode || val.id || val.provinsi_id || val.kab_id || val.kecam_id || "";
                    }
                }
                formData.append(key, val || "");
            }
        }
        this.props.dispatch(pendukung.updateData(cookies.get(cookieName), formData)).then(() => {
            // this.props.dispatch(reset('DataPendukungSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data pendukung:", err);
        });
    }
    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Berkas Pendukung</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Pendukung Wajib Diisi</strong>
                    <br />
                    <small className="ml-4">Isi dengan tanda strip (-) jika tidak memiliki berkas terkait.</small>
                </Alert>
                <FormPendukungSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.pendukung}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormPendukungSeleksi = reduxForm({
    form: 'DataPendukungSeleksi',
    enableReinitialize: true,
})(FormPendukungSeleksi);

const selector = formValueSelector('DataPendukungSeleksi');

FormPendukungSeleksi = connect((store) => {
    let scan_kk = selector(store, 'scan_kk');
    return {
        scan_kk,
    };
})(FormPendukungSeleksi);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
}))(DataPendukungSeleksi);
