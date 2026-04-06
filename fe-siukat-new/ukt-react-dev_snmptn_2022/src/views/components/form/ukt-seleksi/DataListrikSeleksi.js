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
                <Label for="no_pelanggan" md={3}>Nomor Pelanggan</Label>
                <Col md={9}>
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
                <Label for="jenis_pemakaian" md={3}>Status Listrik</Label>
                <Col md={4}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="jenis_pemakaian"
                                value="prabayar"
                            />{' '}Prabayar (Token)</Label>
                    </FormGroup>
                </Col>
                <Col md={5}>
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
            </FormGroup>

            <FormGroup row className="mb-4">
                <Label md={3} xs={12}>Biaya Listrik</Label>
                <Col md={5} xs={12}>
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
                        <ul className="list-reset">
                            <li>Biaya listrik <b>Total 3 Bulan Terakhir</b>;</li>
                            <li>Isi dengan angka <b>satu (1)</b> jika biaya listrik sama dengan Rp. 0.</li>
                        </ul>
                    </FormText>
                </Col>
                <Col md={4} xs={12}>
                    <Alert color="success">{rupiah(pengeluaran)}</Alert>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="file_scan_listrik" md={3}>Bukti Tagihan Listrik</Label>
                <Col md={5}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_listrik"
                        id="file_scan_listrik"
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>Bukti tagihan listrik <b>Total 3 Bulan Terakhir</b>;</li>
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_listrik && (
                    <Col md={4}>
                        <a
                            href={
                                storage +
                                '/' +
                                props.initialValues.no_peserta +
                                '/' +
                                scan_listrik
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block"
                        >
                            <i className="fa fa-file"></i> Lihat Bukti Tagihan Listrik
                        </a>
                    </Col>
                )}
            </FormGroup>

            <FormGroup row className="mt-5 border-top pt-4 mb-0">
                <Col md={{ size: 8 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
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
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(listrik.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('DataListrikSeleksi'));
        this.props.updateVerifikasi();
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
