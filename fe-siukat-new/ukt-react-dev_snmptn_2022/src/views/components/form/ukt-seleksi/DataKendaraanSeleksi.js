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
import { kendaraan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormKendaraanSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        status_mobil,
        status_motor,
        pajak_motor,
        pajak_mobil,
    } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <legend>
                    <i className="fa fa-motorcycle"></i> Data Motor
                </legend>
            </FormGroup>
            <FormGroup row>
                <Label for="status_motor" md={3} xs={12}>Status Motor</Label>
                <Col md={4} xs={12}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_motor"
                                value="ada"
                            />{' '}Ada</Label>
                    </FormGroup>
                </Col>
                <Col md={5} xs={12}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_motor"
                                value="tidak"
                            />{' '}Tidak Ada</Label>
                    </FormGroup>
                </Col>
            </FormGroup>

            {status_motor === 'ada' && (
                <>
                    <FormGroup row>
                        <Label for="jumlah_motor" md={3} xs={12}>Jumlah Motor</Label>
                        <Col md={9}>
                            <Field
                                type="number"
                                component={InputBs}
                                name="jumlah_motor"
                                id="jumlah_motor"
                                placeholder="Jumlah Motor"
                            />
                            <FormText>
                                <ul className="list-reset">
                                    <li>Jumlah motor yang dimiliki anggota keluarga dalam Kartu Keluarga</li>
                                </ul>
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="pajak_motor" md={3} xs={12}>Total Pajak Motor</Label>
                        <Col md={5} xs={12}>
                            <Field
                                type="number"
                                component={InputBs}
                                pattern="[0-9]*"
                                title="Hanya isi dengan angka (0-9)"
                                name="pajak_motor"
                                id="pajak_motor"
                                placeholder="Total Pajak Motor"
                                validate={[money]}
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Total Pajak Motor <b>per tahun</b>;</li>
                                    <li>Jika memiliki lebih dari 1 motor, maka masukkan{' '}<b>jumlah total</b> pajak masing-masing motor yang dimiliki;</li>
                                    <li>Hanya isi dengan angka (0-9).</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4} xs={12}>
                            <Alert color="success">{rupiah(pajak_motor)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="file_scan_motor" md={3}>STNK Motor</Label>
                        <Col md={5}>
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_motor"
                                id="file_scan_motor"
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Scan seluruh STNK motor yang dimiliki;</li>
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        {props.initialValues.scan_motor && (
                            <Col md={4}>
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_motor
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block"
                                >
                                    <i className="fa fa-file"></i> Lihat STNK Motor
                                </a>
                            </Col>
                        )}
                    </FormGroup>
                </>
            )}

            <FormGroup>
                <legend>
                    <i className="fa fa-car"></i> Data Mobil
                </legend>
            </FormGroup>
            <FormGroup row>
                <Label for="status_mobil" md={3} xs={12}>
                    Status Mobil</Label>
                <Col md={4} xs={12}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_mobil"
                                value="ada"
                            />{' '}Ada</Label>
                    </FormGroup>
                </Col>
                <Col md={5} xs={12}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_mobil"
                                value="tidak"
                            />{' '}Tidak Ada</Label>
                    </FormGroup>
                </Col>
            </FormGroup>

            {status_mobil === 'ada' && (
                <div>
                    <FormGroup row>
                        <Label for="jumlah_mobil" md={3} xs={12}>Jumlah Mobil</Label>
                        <Col md={9}>
                            <Field
                                type="number"
                                component={InputBs}
                                name="jumlah_mobil"
                                id="jumlah_mobil"
                                placeholder="Jumlah Mobil"
                            />
                            <FormText>
                                <ul className="list-reset">
                                    <li>Jumlah mobil yang dimiliki anggota keluarga dalam Kartu
                                        Keluarga</li>
                                    <li>Hanya isi dengan angka (0-9).</li>
                                </ul>
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="pajak_mobil" md={3} xs={12}>Total Pajak Mobil</Label>
                        <Col md={5} xs={12}>
                            <Field
                                type="number"
                                component={InputBs}
                                pattern="[0-9]*"
                                title="Hanya isi dengan angka (0-9)"
                                name="pajak_mobil"
                                id="pajak_mobil"
                                placeholder="Total Pajak Mobil"
                                validate={[money]}
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Total Pajak Mobil <b>per tahun</b>;</li>
                                    <li>Jika memiliki lebih dari 1 mobil, maka masukkan{' '}<b>jumlah total</b> pajak masing-masing mobil yang dimiliki;</li>
                                    <li>Hanya isi dengan angka (0-9).</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4} xs={12}>
                            <Alert color="success">{rupiah(pajak_mobil)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="file_scan_mobil" md={3}>STNK Mobil</Label>
                        <Col md={5}>
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_mobil"
                                id="file_scan_mobil"
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Scan seluruh STNK mobil yang dimiliki;</li>
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        {props.initialValues.scan_mobil && (
                            <Col md={4}>
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_mobil
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block"
                                >
                                    <i className="fa fa-file"></i> Lihat STNK Mobil
                                </a>
                            </Col>
                        )}
                    </FormGroup>
                </div>
            )}

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

class DataKendaraanSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(kendaraan.getByLoggedIn(cookies.get(cookieName)));
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
        this.props.dispatch(
            kendaraan.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataKendaraanSeleksi'));
        this.props.updateVerifikasi();
    }

    render() {
        return (
            <Card body>
                <CardTitle>Data Kendaraan</CardTitle>
                <FormKendaraanSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.kendaraan}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormKendaraanSeleksi = reduxForm({
    form: 'DataKendaraanSeleksi',
    enableReinitialize: true,
})(FormKendaraanSeleksi);

const selector = formValueSelector('DataKendaraanSeleksi');

FormKendaraanSeleksi = connect((store) => {
    let { status_motor, status_mobil, pajak_motor, pajak_mobil } = selector(
        store,
        'status_motor',
        'status_mobil',
        'pajak_motor',
        'pajak_mobil'
    );
    return {
        status_motor,
        status_mobil,
        pajak_motor,
        pajak_mobil,
    };
})(FormKendaraanSeleksi);

export default connect((store) => ({
    kendaraan: store.kendaraan.kendaraan,
}))(DataKendaraanSeleksi);
