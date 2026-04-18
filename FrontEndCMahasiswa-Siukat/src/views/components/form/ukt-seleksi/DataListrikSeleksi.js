import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Row,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    money,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { listrik } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormListrikSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        pengeluaran,
        scan_listrik,
    } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="no_pelanggan" col="12" xl="3" className="mb-2 mb-xl-0">Nomor Pelanggan</Label>
                <Col col="12" xl="9">
                    <Field
                        type="text"
                        component={InputBs}
                        name="no_pelanggan"
                        id="no_pelanggan"
                        placeholder="Nomor Pelanggan PLN"
                    />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="jenis_pemakaian" col="12" xl="3" className="mb-2 mb-xl-0">Status Listrik</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="jenis_pemakaian"
                                        value="prabayar"
                                    />{' '}Prabayar</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="8" xl="9">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="jenis_pemakaian"
                                        value="pascabayar"
                                    />{' '}Pascabayar</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            <FormGroup row className="mb-4">
                <Label col="12" xl="3" className="mb-2 mb-xl-0">Biaya Listrik</Label>
                <Col col="12" xl="6">
                    <Field
                        type="number"
                        component={InputBs}
                        pattern="[0-9]*"
                        title="Hanya isi dengan angka (0-9)"
                        name="pengeluaran"
                        placeholder="Biaya Listrik"
                        id="pengeluaran"
                        validate={[money]}
                    />
                    <FormText color="muted">
                        <ul className="list-reset text-xs sm:text-sm">
                            <li>Biaya listrik <b>Total 3 Bulan Terakhir</b>;</li>
                            <li>Isi dengan angka <b>satu (1)</b> jika biaya listrik sama dengan Rp. 0.</li>
                        </ul>
                    </FormText>
                </Col>
                <Col col="12" xl="3" className="mt-2 mt-xl-0">
                    <Alert color="success" className="mb-0 py-2 text-center text-sm">{rupiah(pengeluaran)}</Alert>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="file_scan_listrik" col="12" xl="3" className="mb-2 mb-xl-0">Bukti Tagihan Listrik</Label>
                <Col col="12" xl="6">
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_listrik"
                        id="file_scan_listrik"
                    />
                    <FormText color="muted">
                        <ul className="list-reset text-xs sm:text-sm">
                            <li>Bukti tagihan listrik <b>Total 3 Bulan Terakhir</b>;</li>
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_listrik && (
                    <Col col="12" xl="3" className="mt-2 mt-xl-0">
                        <a
                            href={
                                storage +
                                '/' +
                                scan_listrik
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block py-2 text-sm"
                        >
                            <i className="fa fa-file"></i> Lihat Bukti Listrik
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
                        <i className="fa fa-save mr-2"></i> Simpan Data Listrik
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataListrikSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(listrik.getByLoggedIn(cookies.get(cookieName)));
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
        this.props.dispatch(listrik.updateData(cookies.get(cookieName), formData)).then(() => {
            // this.props.dispatch(reset('DataListrikSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data listrik:", err);
        });
    }

    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Data Listrik</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Listrik Wajib Diisi</strong>
                </Alert>
                <FormListrikSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.listrik}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormListrikSeleksi = reduxForm({
    form: 'DataListrikSeleksi',
    enableReinitialize: true,
})(FormListrikSeleksi);

const selector = formValueSelector('DataListrikSeleksi');

FormListrikSeleksi = connect((store) => {
    let { pengeluaran, scan_listrik } = selector(
        store,
        'pengeluaran',
        'scan_listrik'
    );
    return {
        pengeluaran,
        scan_listrik,
    };
})(FormListrikSeleksi);

export default connect((store) => ({
    listrik: store.listrik.listrik,
}))(DataListrikSeleksi);
