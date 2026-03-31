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
import { connect } from 'react-redux';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import {
    bio_sekolah_cmahasiswa,
    cmahasiswa,
    provinsi,
    kabkot,
    kecamatan,
    bio_jurusan,
    bio_ref_sekolah,
} from '../../../../actions';
import { cookies, cookieName, storage } from '../../../../global';

let FormDataSekolah = (props) => {
    const {
        goToDapodik,
        // checkNPSN,
        // getModelsAPI,
        // npsnSekolah,
        SekolahOnChange,
        handleSubmit,
        pristine,
        submitting,
        ref_jurusan,
        // ref_sekolah,
        scan_skl_ijazah,
    } = props;
    // const handleProvinsi = (e) => {
    //   dispatch(kabkot.fetchForCmahasiswa(e.target.value));
    //   dispatch(
    //     kecamatan.fetchForCmahasiswa({
    //       type: "FETCH_KECAMATAN_MHS_FULFILLED",
    //       payload: [],
    //     })
    //   );
    // };
    // const handleKabkot = (e) => {
    //   dispatch(kecamatan.fetchForCmahasiswa(e.target.value));
    // };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="nisn" md={3}>
                    NISN
                </Label>
                <Col md={9}>
                    <Field
                        name="nisn"
                        component={InputBs}
                        type="text"
                        placeholder="NISN"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="npsn" md={3}>
                    NPSN Sekolah Asal
                </Label>
                <Col md={9}>
                    {/* <Field name="npsn" component={InputBs} type="select" disabled>
            {" "}
            <option value="">-- Pilih Sekolah Asal --</option>
            {Array.isArray(ref_sekolah)
              ? ref_sekolah.map((data, key) => (
                  <option value={data.npsn} key={key}>
                    {data.nama_sekolah}
                  </option>
                ))
              : ""}
          </Field> */}
                    {/* <AsyncSelect
            value={npsnSekolah}
            name="npsn"
            loadOptions={getModelsAPI}
            placeholder="ketik npsn atau nama sekolah"
            onChange={SekolahOnChange}
          /> */}
                    <Field
                        name="npsn"
                        component={InputBs}
                        type="text"
                        rows="3"
                        placeholder="NPSN Sekolah Asal"
                        onChange={SekolahOnChange}
                    />{' '}
                    {/* <Link to="https://dapo.dikdasmen.kemdikbud.go.id/sp" target="_blank">
            Daftar NPSN
          </Link> */}
                    <br />
                    <Button id="bt" onClick={goToDapodik} color="info">
                        Lihat NPSN Sekolah
                    </Button>
          &nbsp;&nbsp;
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="alamat_sekolah" md={3}>
                    Alamat Sekolah
                </Label>
                <Col md={9}>
                    <Field
                        name="alamat_sekolah"
                        component={InputBs}
                        type="textarea"
                        rows="3"
                        placeholder="Alamat Sekolah"
                    />{' '}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_jurusan" md={3}>
                    Jurusan
                </Label>
                <Col md={9}>
                    <Field name="kode_jurusan" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Jurusan --</option>
                        {Array.isArray(ref_jurusan)
                            ? ref_jurusan.map((data, key) => (
                                <option value={data.jurusan_id} key={key}>
                                    {data.jurusan_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="tahun_masuk" md={3}>
                    Tahun Masuk
                </Label>
                <Col md={9}>
                    <Field
                        name="tahun_masuk"
                        component={InputBs}
                        type="number"
                        placeholder="Tahun Masuk"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="tahun_lulus" md={3}>
                    Tahun Lulus
                </Label>
                <Col md={9}>
                    <Field
                        name="tahun_lulus"
                        component={InputBs}
                        type="number"
                        placeholder="Tahun Lulus"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="rata_UN" md={3}>
                    Rata-rata Nilai UN
                </Label>
                <Col md={9}>
                    <Field
                        name="rata_UN"
                        component={InputBs}
                        type="number"
                        placeholder="Rata-rata Nilai UN"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="mapel_UN" md={3}>
                    Jumlah Mata Pelajaran UN
                </Label>
                <Col md={9}>
                    <Field
                        name="mapel_UN"
                        component={InputBs}
                        type="number"
                        placeholder="Jumlah Mata Pelajaran UN"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="no_peserta_UN" md={3}>
                    Nomor Peserta UN
                </Label>
                <Col md={9}>
                    <Field
                        name="no_peserta_UN"
                        component={InputBs}
                        type="text"
                        placeholder="Nomor Peserta UN"
                    />
                </Col>
            </FormGroup>

            <FormGroup row>
                <Label for="rata_ijazah" md={3}>
                    Rata-rata Ijazah
                </Label>
                <Col md={9}>
                    <Field
                        name="rata_ijazah"
                        component={InputBs}
                        type="number"
                        placeholder="Rata-rata Ijazah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="mapel_ijazah" md={3}>
                    Jumlah Mata Pelajaran Ijazah
                </Label>
                <Col md={9}>
                    <Field
                        name="mapel_ijazah"
                        component={InputBs}
                        type="number"
                        placeholder="Jumlah Mata Pelajaran Ijazah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="no_ijazah" md={3}>
                    Nomor Ijazah
                </Label>
                <Col md={9}>
                    <Field
                        name="no_ijazah"
                        component={InputBs}
                        type="text"
                        placeholder="Nomor Ijazah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="file_scan_skl_ijazah" md={3}>
                    SKL/Ijazah
                </Label>
                <Col md={5}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        name="file_scan_skl_ijazah"
                        id="file_scan_skl_ijazah"
                        accept="application/pdf"
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_skl_ijazah && (
                    <Col md={4}>
                        <a
                            href={
                                storage +
                                '/' +
                                props.initialValues.no_peserta +
                                '/' +
                                scan_skl_ijazah
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block"
                        >
                            <i className="fa fa-file"></i> Lihat SKL/Ijazah
                        </a>
                    </Col>
                )}
            </FormGroup>

            <FormGroup row>
                <Col md={{ size: 12 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col md={{ size: 9 }} xs="12">
                    <Alert color="info">
                        <ul>
                            <li>
                                Apabila <b>Nomor Peserta UN</b> tidak ada, dan{' '}
                                <b>Nomor Ijazah</b> belum didapat dapat diisi dengan <b>{'"-"'}</b>.
                            </li>
                            <li>
                                Rata-rata nilai UN dan jumlah mata pelajaran UN Boleh
                                dikosongkan jika tidak memiliki nilai UN.
                            </li>
                            <li>
                                Rata-rata nilai ijazah dan jumlah mata pelajaran ijazah Boleh
                                dikosongkan jika belum memiliki Ijazah
                            </li>
                            <li>SKL : Surat Keterangan Lulus</li>
                        </ul>
                    </Alert>
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

class DataSekolah extends React.Component {
    constructor(props) {
        super(props);
        this.state = { npsnSekolah: '' };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(bio_jurusan.fetchForJurusan());
        this.props.dispatch(bio_ref_sekolah.fetchForRefSekolah());
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName)));
        this.props.dispatch(
            bio_sekolah_cmahasiswa.fetchAllData(cookies.get(cookieName))
        );
    }
    submitForm = (values) => {
        // var formData = new FormData();
        // var data = {};
        // for (var key in values) {
        //   data[key] = values[key];
        // }
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
            bio_sekolah_cmahasiswa.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataSekolah'));
        this.props.updateVerifikasi();
    }

    getModelsAPI = (input) => {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        const url = `https://dapo.kemdikbud.go.id/api/getHasilPencarian?keyword=${input}`;

        fetch(url, { credentials: 'include' })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const formatted = json.map((l) => {
                    return Object.assign(
                        {},
                        {
                            value: l.npsn,
                            label: l.nama_sekolah,
                        }
                    );
                });
                return { options: formatted };
            });
    }

    SekolahOnChange = (value) => {
        this.setState({
            npsnSekolah: value,
        });
    }

    goToDapodik = () => {
        window.open(
            'https://dapo.kemdikbud.go.id/pencarian',
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    checkNPSN = () => {
        window.open(
            `https://referensi.data.kemdikbud.go.id/tabs.php?npsn=${this.props.bio_sekolah_cmahasiswa.npsn}`,
            '_blank'
        );
    }

    render = () => {
        return (
            <Card body>
                <CardTitle>Data Sekolah</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Data Sekolah{' '}
                    <b>Wajib Diisi</b>
                </Alert>
                <FormDataSekolah
                    onSubmit={this.submitForm}
                    initialValues={this.props.bio_sekolah_cmahasiswa}
                    allow={this.props.allow}
                    npsnSekolah={
                        this.props.bio_sekolah_cmahasiswa.npsn != ''
                            ? this.props.bio_sekolah_cmahasiswa.npsn
                            : ''
                    }
                    SekolahOnChange={this.SekolahOnChange}
                    getModelsAPI={this.getModelsAPI}
                    goToDapodik={this.goToDapodik}
                    checkNPSN={this.checkNPSN}
                />
            </Card>
        );
    }
}

FormDataSekolah = reduxForm({
    form: 'DataSekolah',
    enableReinitialize: true,
})(FormDataSekolah);

const selector = formValueSelector('DataSekolah');

FormDataSekolah = connect(
    (store) => {
        let scan_skl_ijazah = selector(store, 'scan_skl_ijazah');
        return {
            scan_skl_ijazah,

            ref_jurusan: store.bio_jurusan.bio_jurusan,
            ref_sekolah: store.bio_ref_sekolah.bio_ref_sekolah,
            ref_provinsi: store.provinsi.provinsi,
            ref_kabkot: store.kabkot.kabkot_cmahasiswa,
            ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
        };
    },
    {
        kabkot,
        kecamatan,
    }
)(FormDataSekolah);

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    bio_sekolah_cmahasiswa: store.bio_sekolah_cmahasiswa.bio_sekolah_cmahasiswa,
}))(DataSekolah);
