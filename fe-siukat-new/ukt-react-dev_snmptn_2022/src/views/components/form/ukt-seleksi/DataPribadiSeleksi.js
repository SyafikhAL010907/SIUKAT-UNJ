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
    Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputDayPicker,
    InputFileBs,
    money,
    SyaratFoto,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormDataPribadiSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_provinsi,
        ref_kabkot,
        ref_kecamatan,
        penghasilan_cmahasiswa,
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
                <Label for="nama_cmahasiswa" md={3}>
                    Nama Lengkap
                </Label>
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
                <Label for="gender_cmahasiswa" md={3}>
                    Jenis Kelamin
                </Label>
                <Col md={9}>
                    <Row>
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
                    </Row>
                </Col>

            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    Tempat &amp;
                    Tanggal Lahir
                </Label>
                <Col md={9} xs={12}>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Field
                                name="tempat_lahir_cmahasiswa"
                                component={InputBs}
                                type="text"
                                placeholder="Tempat Lahir"
                            />{' '}
                        </Col>
                        <Col md={6}>
                            <Field
                                name="tanggal_lahir_cmahasiswa"
                                component={InputDayPicker}
                                startYear={1990}
                                placeholder="Tanggal Lahir"
                            />
                        </Col>
                    </Row>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="alamat_cmahasiswa" md={3}>
                    Alamat Lengkap
                </Label>
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
                <Label for="provinsi_cmahasiswa" md={3}>
                    Provinsi
                </Label>
                <Col md={9}>
                    <Field
                        name="provinsi_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleProvinsi}
                    >
                        {' '}
                        <option value="">-- Pilih Provinsi --</option>
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
                <Label for="kabkot_cmahasiswa" md={3}>
                    Kab/Kota
                </Label>
                <Col md={9}>
                    <Field
                        name="kabkot_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleKabkot}
                    >
                        {' '}
                        <option value="">-- Pilih Kabupaten/Kota --</option>
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
                <Label for="kecamatan_cmahasiswa" sm={3}>
                    Kecamatan
                </Label>
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
                <Label for="telepon_cmahasiswa" md={3}>
                    Nomor Telepon
                </Label>
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
                <Label for="goldar_cmahasiswa" md={3}>
                    Golongan Darah
                </Label>
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
                <Label for="sosmed_cmahasiswa" md={3}>
                    Sosial Media
                </Label>
                <Col md={9}>
                    <Field
                        name="sosmed_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Facebook/Twitter/Instagram"
                    />
                    <FormText color="muted">Facebook/Twitter/Instagram</FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="penghasilan_cmahasiswa" md={3}>
                    Penghasilan Pribadi
                </Label>
                <Col md={5} xs={12}>
                    <Field
                        type="number"
                        component={InputBs}
                        pattern="[0-9]*"
                        title="Hanya isi dengan angka (0-9)"
                        name="penghasilan_cmahasiswa"
                        id="penghasilan_mahasiswa"
                        placeholder="Penghasilan Sendiri"
                        validate={[money]}
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>
                                Penghasilan <b>per bulan</b>;
                            </li>
                            {/* <li>Hanya isi dengan angka (0-9).</li> */}
                            <li>Tidak perlu menuliskan titik (.) dan koma (,).</li>
                        </ul>
                    </FormText>
                </Col>
                <Col md={4} xs={12}>
                    <Alert color="success">{rupiah(penghasilan_cmahasiswa)}</Alert>
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
                                    storage +
                                    '/' +
                                    props.initialValues.no_peserta +
                                    '/' +
                                    props.initialValues.foto_cmahasiswa
                                }
                                className="img-thumbnail img-responsive"
                                alt="foto-cmahasiswa"
                            />
                        </div>
                    )}
                </Label>
                <Col md={6} xs={12}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        className="form-control"
                        name="file_foto_cmahasiswa"
                        id="file_foto_cmahasiswa"
                    />
                    <SyaratFoto />
                </Col>
                <Col md={3} xs={12}>
                    <FormText color="muted">Contoh Pas Foto:</FormText>
                    <img
                        src={SampleFoto}
                        className="img-thumbnail img-responsive"
                        alt="sample-foto"
                    />
                </Col>
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

class DataPribadiSeleksi extends React.Component {
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
                <FormDataPribadiSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.cmahasiswa}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormDataPribadiSeleksi = reduxForm({
    form: 'DataPribadiSeleksi',
    enableReinitialize: true,
})(FormDataPribadiSeleksi);

const selector = formValueSelector('DataPribadiSeleksi');

FormDataPribadiSeleksi = connect(
    (store) => {
        let penghasilan_cmahasiswa = selector(store, 'penghasilan_cmahasiswa');
        return {
            penghasilan_cmahasiswa,

            ref_provinsi: store.provinsi.provinsi,
            ref_kabkot: store.kabkot.kabkot_cmahasiswa,
            ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
        };
    },
    {
        kabkot,
        kecamatan,
    }
)(FormDataPribadiSeleksi);

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
}))(DataPribadiSeleksi);
