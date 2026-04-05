import React from 'react';
// import SampleFoto from '../../../dist/img/pas_foto.jpg'
import SampleFoto from '../../../dist/img/PasPhoto.jpg';
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
import { Field, reduxForm, reset } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    InputDayPicker,
    SyaratFoto,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';

let FormDataPribadi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_provinsi,
        ref_kabkot,
        ref_kecamatan,
    } = props;
    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForCmahasiswa(e.target.value));
        dispatch(
            kecamatan.fetchForCmahasiswa({
                type: 'FETCH_KECAMATAN_MHS_FULFILLED',
                payload: [],
            })
        );
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForCmahasiswa(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="nama_cmahasiswa" md={3}>Nama Lengkap</Label>
                <Col md={9}>
                    <Field
                        name="nama_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Lengkap"
                        disabled
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="gender_cmahasiswa" md={3}>Jenis Kelamin</Label>
                <Col md={3}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="gender_cmahasiswa"
                                component={InputBs}
                                type="radio"
                                value="laki-laki"
                            />{' '}Laki-Laki</Label>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="gender_cmahasiswa"
                                component={InputBs}
                                type="radio"
                                value="perempuan"
                            />{' '}Perempuan</Label>
                    </FormGroup>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    Tempat &amp; <br />Tanggal Lahir</Label>
                <Col md={5}>
                    <Field
                        name="tempat_lahir_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Tempat Lahir"
                    />{' '}
                </Col>
                <Col md={4} xs={12}>
                    <Field
                        name="tanggal_lahir_cmahasiswa"
                        component={InputDayPicker}
                        startYear={1990}
                        placeholder="Tanggal Lahir"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="alamat_cmahasiswa" md={3}>Alamat Lengkap</Label>
                <Col md={9}>
                    <Field
                        name="alamat_cmahasiswa"
                        component={InputBs}
                        type="textarea"
                        rows="3"
                        placeholder="Alamat Lengkap"
                    />{' '}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="provinsi_cmahasiswa" md={3}>Provinsi</Label>
                <Col md={9}>
                    <Field
                        name="provinsi_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleProvinsi}
                    >
                        {' '}
                        <option value="" disabled={ref_kabkot.length}>
                            -- Pilih Provinsi --
                        </option>
                        {Array.isArray(ref_provinsi)
                            ? ref_provinsi.map((data, key) => (
                                <option value={data.provinsi_id} key={key}>
                                    {data.provinsi_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kabkot_cmahasiswa" md={3}>Kab/Kota</Label>
                <Col md={9}>
                    <Field
                        name="kabkot_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleKabkot}
                    >
                        {' '}
                        <option value="" disabled={ref_kecamatan.length}>
                            -- Pilih Kabupaten/Kota --
                        </option>
                        {Array.isArray(ref_kabkot)
                            ? ref_kabkot.map((data, key) => (
                                <option value={data.kab_id} key={key}>
                                    {data.kab_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kecamatan_cmahasiswa" sm={3}>Kecamatan</Label>
                <Col sm={9}>
                    <Field name="kecamatan_cmahasiswa" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Kecamatan --</option>
                        {Array.isArray(ref_kecamatan)
                            ? ref_kecamatan.map((data, key) => (
                                <option value={data.kecam_id} key={key}>
                                    {data.kecam_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="telepon_cmahasiswa" md={3}>Nomor Telepon</Label>
                <Col md={9}>
                    <Field
                        name="telepon_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Nomor Telepon"
                        pattern="[0-9]{0,13}"
                        title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                    />
                    <FormText color="muted">
                        Hanya isi dengan angka. Maksimal 13 digit.
                    </FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="goldar_cmahasiswa" md={3}>Golongan Darah</Label>
                <Col md={9}>
                    <Field name="goldar_cmahasiswa" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Golongan Darah --</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="file_foto_cmahasiswa" md={3}>
                    Foto
                    {props.initialValues.foto_cmahasiswa && (
                        <div>
                            <FormText color="muted">Foto Anda saat ini:</FormText>
                            <img
                                src={
                                    props.initialValues.foto_cmahasiswa?.startsWith('http') 
                                    ? props.initialValues.foto_cmahasiswa 
                                    : storage + '/' + props.initialValues.foto_cmahasiswa
                                }
                                className="img-thumbnail img-responsive"
                                alt="foto-cmahasiswa"
                            />
                        </div>
                    )}</Label>
                <Col md={6}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        className="form-control"
                        name="file_foto_cmahasiswa"
                        id="file_foto_cmahasiswa"
                    />
                    <SyaratFoto />
                </Col>
                <Col md={3}>
                    <FormText color="muted">Contoh Pas Foto:</FormText>
                    <img
                        src={SampleFoto}
                        className="img-thumbnail img-responsive"
                        alt="sample-foto"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col md={{ size: 9 }}>
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 3 }}>
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
class DataPribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            if (key === 'file_foto_cmahasiswa') {
                formData.append(key, values[key][0]);
                document.getElementById('file_foto_cmahasiswa').value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(
            cmahasiswa.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataPribadi'));
        this.props.updateVerifikasi();
    }
    render() {
        return (
            <Card body>
                <CardTitle>Data Diri</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Data Pribadi{' '}
                    <b>Wajib Diisi</b>
                </Alert>
                <FormDataPribadi
                    onSubmit={this.submitForm}
                    initialValues={this.props.cmahasiswa}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormDataPribadi = reduxForm({
    form: 'DataPribadi',
    enableReinitialize: true,
})(FormDataPribadi);

FormDataPribadi = connect(
    (store) => ({
        ref_provinsi: store.provinsi.provinsi,
        ref_kabkot: store.kabkot.kabkot_cmahasiswa,
        ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
    }),
    {
        kabkot,
        kecamatan,
    }
)(FormDataPribadi);

export default connect((store) => {
    return {
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    };
})(DataPribadi);
