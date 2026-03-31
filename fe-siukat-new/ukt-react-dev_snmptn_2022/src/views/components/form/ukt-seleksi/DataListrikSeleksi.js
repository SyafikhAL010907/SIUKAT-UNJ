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
import { Link } from 'react-router-dom';
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
            <FormGroup row>
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
            <FormGroup row>
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

            <FormGroup row>
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
            <FormGroup row>
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

            <FormGroup row>
                <Col md={{ size: 9 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 3 }} xs="12">
                    <Button
                        type="submit"
                        color="success"
                        block
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save"></i> Simpan
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
            <Card body>
                <CardTitle>Data Listrik</CardTitle>
                <Alert color="warning">
                    <span>
                        <i className="fa fa-info-circle"></i> Data pemakaian listrik calon mahasiswa
                        <br />
                        Informasi lebih lanjut mengenai tagihan listrik, silakan hubungi:
                    </span>
                    <ul>
                        <li>
                            <i className="fa fa-globe"></i>
                            <Link
                                to="http://www.pln.co.id"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {' '}Website PLN</Link>
                        </li>
                        <li><i className="fa fa-phone"></i> (kode area) 123</li>
                    </ul>

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
