import React from "react";
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
    Collapse,
} from "reactstrap";
import { connect } from "react-redux";
import { Field, reduxForm, reset, formValueSelector } from "redux-form";
import {
    InputBs,
    InputDayPicker,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from "../";
import {
    cmahasiswa,
    bio_ortu_cmahasiswa,
    bio_provinsi,
    bio_kabkot,
    bio_kecamatan,
    bio_pendidikan,
    bio_pekerjaan,
    bio_penghasilan,
} from "../../../../actions";
import { cookies, cookieName } from "../../../../global";

let FormBiodataOrangTua = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_pendidikan,
        ref_pekerjaan,
        ref_penghasilan,
        ref_provinsi,
        ref_kabkot,
        ref_kecamatan,
        //bisa lu siapin di sini
        handleWali,
        collapseWali,
        //abis itu taro deh di render nya, kalo handleWali itu kyk button kan? select
        //kalo collapse itu keadaannya dia sekarang lagi `open` atau `close` ? close
        //coba aja lu taro, gw liatin bener apa engga wkwk //woke
    } = props;
    // console.log(collapseWali);
    const handleProvinsi = (e) => {
        dispatch(bio_kabkot.fetchForBioOrangtua(e.target.value));
        dispatch(
            bio_kecamatan.fetchForBioOrangTua({
                type: "FETCH_KECAMATAN_ORANGTUA_FULFILLED",
                payload: [],
            })
        );
    };
    const handleKabkot = (e) => {
        dispatch(bio_kecamatan.fetchForBioOrangTua(e.target.value));
    };

    //ini gk bisa kyk gini // terus poakai apa
    //kalau function gk bisa pake state

    return (
        <Form onSubmit={handleSubmit}>
            <CardTitle>Biodata Ayah</CardTitle>
            <FormGroup row>
                <Label for="nama_ayah" md={3}>
                    Nama Ayah
        </Label>
                <Col md={9}>
                    <Field
                        name="nama_ayah"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Ayah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="nik_ayah" md={3}>
                    NIK Ayah
        </Label>
                <Col md={9}>
                    <Field
                        name="nik_ayah"
                        component={InputBs}
                        type="text"
                        placeholder="NIK Ayah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    Tanggal Lahir Ayah
        </Label>
                <Col md={9}>
                    <Field
                        name="tanggal_lahir_ayah"
                        component={InputDayPicker}
                        startYear={1900}
                        placeholder="Tanggal Lahir Ayah"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="pendidikan_ayah" md={3}>
                    Pendidikan Ayah
        </Label>
                <Col md={9}>
                    <Field name="pendidikan_ayah" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Pendidikan Ayah --</option>
                        {Array.isArray(ref_pendidikan)
                            ? ref_pendidikan.map((data, key) => (
                                <option value={data.pendidikan_id} key={key}>
                                    {data.pendidikan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="pekerjaan_ayah" md={3}>
                    Pekerjaan Ayah
        </Label>
                <Col md={9}>
                    <Field name="pekerjaan_ayah" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Pekerjaan Ayah --</option>
                        {Array.isArray(ref_pekerjaan)
                            ? ref_pekerjaan.map((data, key) => (
                                <option value={data.pekerjaan_id} key={key}>
                                    {data.pekerjaan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="penghasilan_ayah" md={3}>
                    Penghasilan Ayah
        </Label>
                <Col md={9}>
                    <Field name="penghasilan_ayah" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Penghasilan Ayah --</option>
                        {Array.isArray(ref_penghasilan)
                            ? ref_penghasilan.map((data, key) => (
                                <option value={data.penghasilan_id} key={key}>
                                    {data.penghasilan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <hr />

            <CardTitle>Biodata Ibu</CardTitle>
            <FormGroup row>
                <Label for="nama_ibu" md={3}>
                    Nama Ibu
        </Label>
                <Col md={9}>
                    <Field
                        name="nama_ibu"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Ibu"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="nik_ibu" md={3}>
                    NIK Ibu
        </Label>
                <Col md={9}>
                    <Field
                        name="nik_ibu"
                        component={InputBs}
                        type="text"
                        placeholder="NIK Ibu"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    Tanggal Lahir Ibu
        </Label>
                <Col md={9}>
                    <Field
                        name="tanggal_lahir_ibu"
                        component={InputDayPicker}
                        startYear={1900}
                        placeholder="Tanggal Lahir Ibu"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="pendidikan_ibu" md={3}>
                    Pendidikan Ibu
        </Label>
                <Col md={9}>
                    <Field name="pendidikan_ibu" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Pendidikan Ibu --</option>
                        {Array.isArray(ref_pendidikan)
                            ? ref_pendidikan.map((data, key) => (
                                <option value={data.pendidikan_id} key={key}>
                                    {data.pendidikan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="pekerjaan_ibu" md={3}>
                    Pekerjaan Ibu
        </Label>
                <Col md={9}>
                    <Field name="pekerjaan_ibu" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Pekerjaan Ibu --</option>
                        {Array.isArray(ref_pekerjaan)
                            ? ref_pekerjaan.map((data, key) => (
                                <option value={data.pekerjaan_id} key={key}>
                                    {data.pekerjaan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="penghasilan_ibu" md={3}>
                    Penghasilan Ibu
        </Label>
                <Col md={9}>
                    <Field name="penghasilan_ibu" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Penghasilan Ibu --</option>
                        {Array.isArray(ref_penghasilan)
                            ? ref_penghasilan.map((data, key) => (
                                <option value={data.penghasilan_id} key={key}>
                                    {data.penghasilan_nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <hr />

            <CardTitle>Biodata Wali</CardTitle>
            <Alert color="warning">
                <i className="fa fa-info-circle"></i> Wali dapat meliputi{" "}
                <b>Orang Tua, Saudara, Perusahaan, Yayasan, dan Beasiswa</b> yang
        berkomitmen membiayai calon mahasiswa.
      </Alert>
            <FormGroup row>
                <Label for="pilih_wali" md={3}>
                    Pilih Wali
        </Label>
                <Col md={9}>
                    <Field
                        name="pilih_wali"
                        component={InputBs}
                        type="select"
                        onChange={handleWali}
                    >
                        {" "}
                        <option value="">-- Pilih Wali --</option>
                        <option value="ayah">Ayah</option>
                        <option value="ibu">Ibu</option>
                        <option value="lainnya">Wali Lainnya</option>
                    </Field>
                </Col>
            </FormGroup>

            <FormGroup row>
                <Label for="hubungan_wali" md={3}>
                    Hubungan Dengan Wali
        </Label>
                <Col md={9}>
                    <Field
                        name="hubungan_wali"
                        component={InputBs}
                        type="text"
                        placeholder="Hubungan Dengan Wali"
                        title="Dapat diisi dengan Kakak/ Paman / keluarga lainnya"
                    />
                    <FormText color="muted">
                        Dapat diisi dengan Kakak/ Paman / keluarga lainnya.
          </FormText>
                </Col>
            </FormGroup>

            <Collapse isOpen={collapseWali}>
                <FormGroup row>
                    <Label for="nama_wali" md={3}>
                        Nama Wali
          </Label>
                    <Col md={9}>
                        <Field
                            name="nama_wali"
                            component={InputBs}
                            type="text"
                            placeholder="Nama Wali"
                        />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label md={3} xs={12}>
                        Tanggal Lahir Wali
          </Label>
                    <Col md={9}>
                        <Field
                            name="tanggal_lahir_wali"
                            component={InputDayPicker}
                            startYear={1900}
                            placeholder="Tanggal Lahir Wali"
                        />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="nik_wali" md={3}>
                        NIK Wali
          </Label>
                    <Col md={9}>
                        <Field
                            name="nik_wali"
                            component={InputBs}
                            type="text"
                            placeholder="NIK Wali"
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="pendidikan_wali" md={3}>
                        Pendidikan Wali
          </Label>
                    <Col md={9}>
                        <Field name="pendidikan_wali" component={InputBs} type="select">
                            {" "}
                            <option value="">-- Pilih Pendidikan Wali --</option>
                            {Array.isArray(ref_pendidikan)
                                ? ref_pendidikan.map((data, key) => (
                                    <option value={data.pendidikan_id} key={key}>
                                        {data.pendidikan_nama}
                                    </option>
                                ))
                                : ""}
                        </Field>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="pekerjaan_wali" md={3}>
                        Pekerjaan Wali
          </Label>
                    <Col md={9}>
                        <Field name="pekerjaan_wali" component={InputBs} type="select">
                            {" "}
                            <option value="">-- Pilih Pekerjaan Wali --</option>
                            {Array.isArray(ref_pekerjaan)
                                ? ref_pekerjaan.map((data, key) => (
                                    <option value={data.pekerjaan_id} key={key}>
                                        {data.pekerjaan_nama}
                                    </option>
                                ))
                                : ""}
                        </Field>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="penghasilan_wali" md={3}>
                        Penghasilan Wali
          </Label>
                    <Col md={9}>
                        <Field name="penghasilan_wali" component={InputBs} type="select">
                            {" "}
                            <option value="">-- Pilih Penghasilan Wali --</option>
                            {Array.isArray(ref_penghasilan)
                                ? ref_penghasilan.map((data, key) => (
                                    <option value={data.penghasilan_id} key={key}>
                                        {data.penghasilan_nama}
                                    </option>
                                ))
                                : ""}
                        </Field>
                    </Col>
                </FormGroup>
            </Collapse>

            <hr />

            <CardTitle>Alamat dan Kontak Wali</CardTitle>
            <FormGroup row>
                <Label for="kode_provinsi" md={3}>
                    Provinsi
        </Label>
                <Col md={9}>
                    <Field
                        name="kode_provinsi"
                        component={InputBs}
                        type="select"
                        onChange={handleProvinsi}
                    >
                        {" "}
                        <option value="">-- Pilih Provinsi --</option>
                        {Array.isArray(ref_provinsi)
                            ? ref_provinsi.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_kabkot" md={3}>
                    Kab/Kota
        </Label>
                <Col md={9}>
                    <Field
                        name="kode_kabkot"
                        component={InputBs}
                        type="select"
                        onChange={handleKabkot}
                    >
                        {" "}
                        <option value="">-- Pilih Kabupaten/Kota --</option>
                        {Array.isArray(ref_kabkot)
                            ? ref_kabkot.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_kecamatan" sm={3}>
                    Kecamatan
        </Label>
                <Col sm={9}>
                    <Field name="kode_kecamatan" component={InputBs} type="select">
                        {" "}
                        <option value="">-- Pilih Kecamatan --</option>
                        {Array.isArray(ref_kecamatan)
                            ? ref_kecamatan.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ""}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kelurahan" md={3}>
                    Kelurahan/Desa
        </Label>
                <Col md={9}>
                    <Field
                        name="kelurahan"
                        component={InputBs}
                        type="text"
                        placeholder="Kelurahan/Desa"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="alamat" md={3}>
                    Alamat Lengkap
        </Label>
                <Col md={9}>
                    <Field
                        name="alamat"
                        component={InputBs}
                        type="textarea"
                        rows="3"
                        placeholder="Alamat Lengkap"
                    />{" "}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    RT &amp; RW
        </Label>
                <Col md={5}>
                    <Field name="rt" component={InputBs} type="text" placeholder="RT" />{" "}
                </Col>
                <Col md={4} xs={12}>
                    <Field name="rw" component={InputBs} type="text" placeholder="RW" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_pos" md={3}>
                    Kode POS
        </Label>
                <Col md={9}>
                    <Field
                        name="kode_pos"
                        component={InputBs}
                        type="text"
                        placeholder="Kode POS"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kontak" md={3}>
                    Kontak
        </Label>
                <Col md={9}>
                    <Field
                        name="kontak"
                        component={InputBs}
                        type="text"
                        placeholder="Kontak"
                    />
                </Col>
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
                                <b>NIK</b> : Nomor Induk Kependudukan
              </li>
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

class BiodataOrangTua extends React.Component {
    constructor(props) {
        super(props);
        // this.toggle = this.toggle.bind(this);
        this.state = { collapseWali: true };

        // gk perlu kyk gini, biasanya ini kalo bentuknya function
        // this.handleWali = this.handleWali.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(bio_provinsi.fetchBioProvinsi());
        this.props.dispatch(bio_pendidikan.fetchForPendidikan());
        this.props.dispatch(bio_pekerjaan.fetchForPekerjaan());
        this.props.dispatch(bio_penghasilan.fetchForPenghasilan());
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName)));
        this.props.dispatch(
            bio_ortu_cmahasiswa.fetchAllData(cookies.get(cookieName))
        );
        // this.state = { collapse: false };
    }
    submitForm = (values) => {
        // var formData = new FormData();
        var data = {};
        for (var key in values) {
            data[key] = values[key];
        }
        this.props.dispatch(
            bio_ortu_cmahasiswa.updateData(cookies.get(cookieName), data)
        );
        this.props.dispatch(reset("BiodataOrangTua"));
        this.props.updateVerifikasi();
    };

    //contoh
    //kalo kyk gini (bukan arrow function) mesti di bind di constructor
    // handleWali(){
    //   console.log(e.target.value);
    //   if (e.target.value == "lainnya") {
    //     console.log("masuk");
    //     // collapseIsOpen = true;
    //     this.setState({ collapse: !this.state.collapse });
    //   }
    // }

    //di sini
    // kalo arrow function kyk gini gk perlu di bind
    handleWali = (e) => {
        // console.log(e);
        if (e.target.value == "lainnya") {
            // console.log("masuk");
            // collapseIsOpen = true;
            this.setState({ collapseWali: !this.state.collapseWali });
            // console.log(this.props.bio_ortu_cmahasiswa);
            // nama_wali.target.value = null;
        } else {
            this.setState({ collapseWali: true });
        }
    };

    render() {
        return (
            <Card body>
                <CardTitle>Biodata Orang Tua dan Wali</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Biodata Orang
          Tua dan Wali <b>Wajib Diisi</b>
                </Alert>
                <FormBiodataOrangTua
                    onSubmit={this.submitForm}
                    initialValues={this.props.bio_ortu_cmahasiswa}
                    allow={this.props.allow}
                    // kalo udah buat state sama handle, tinggal di kasih aja ke sini
                    collapseWali={
                        (this.props.bio_ortu_cmahasiswa.nama_wali != null &&
                            this.props.bio_ortu_cmahasiswa.pilih_wali == "lainnya") ||
                            this.props.bio_ortu_cmahasiswa.pilih_wali == "lainnya"
                            ? this.state.collapseWali
                            : !this.state.collapseWali
                    }
                    handleWali={this.handleWali}
                //nah nanti bisa diakses lewat props
                //props.collaps, props.handleWali
                //kalo gw ganti namanya misal
                // waliHandle={this.handleWali}
                // berarti nanti FormBiodataOrangTua jadi props.waliHandle
                // oke jadi tinggal panggil aja ya variable yg baru
                // iya, tinggal panggil di FormBiodataOrangTua
                />
            </Card>
        );
    }
}

FormBiodataOrangTua = reduxForm({
    form: "BiodataOrangTua",
    enableReinitialize: true,
})(FormBiodataOrangTua);

const selector = formValueSelector("BiodataOrangTua");

FormBiodataOrangTua = connect(
    (store) => {
        let penghasilan_cmahasiswa = selector(store, "penghasilan_cmahasiswa");
        return {
            penghasilan_cmahasiswa,

            ref_pendidikan: store.bio_pendidikan.bio_pendidikan,
            ref_pekerjaan: store.bio_pekerjaan.bio_pekerjaan,
            ref_penghasilan: store.bio_penghasilan.bio_penghasilan,
            ref_provinsi: store.bio_provinsi.bio_provinsi,
            ref_kabkot: store.bio_kabkot.bio_kabkot_orangtua,
            ref_kecamatan: store.bio_kecamatan.bio_kecamatan_orangtua,
        };
    },
    {
        bio_kabkot,
        bio_kecamatan,
    }
)(FormBiodataOrangTua);

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    bio_ortu_cmahasiswa: store.bio_ortu_cmahasiswa.bio_ortu_cmahasiswa,
}))(BiodataOrangTua);
