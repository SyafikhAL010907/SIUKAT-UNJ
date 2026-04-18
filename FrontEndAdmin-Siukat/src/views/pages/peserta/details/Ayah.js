import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Alert,
  FormText,
} from "reactstrap";
import { Field, reduxForm, reset, formValueSelector } from "redux-form";
import {
  ayah,
  provinsi,
  pekerjaan,
  kabkot,
  kecamatan,
} from "../../../../actions";
import {
  InputBs,
  InputDayPicker,
  InputFileBs,
  money,
} from "../../../components";
import {
  cookies,
  cookieName,
  rupiah,
  storage,
  service,
  dateConverter,
} from "../../../../global";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let FormAyah = (props) => {
  const {
    handleSubmit,
    handleToggleAyah,
    toggleAyah,
    pristine,
    submitting,
    dispatch,
    ref_pekerjaan,
    ref_provinsi_ayah,
    ref_kabkot_ayah,
    ref_kecamatan_ayah,
    status_ayah,
    penghasilan_ayah,
    sampingan_ayah,
  } = props;

  const handleProvinsi = (e) => {
    dispatch(kabkot.fetchForAyah(e.target.value));
    dispatch(
      kecamatan.fetchForAyah({
        type: "FETCH_KECAMATAN_FULFILLED",
        payload: [],
      }),
    );
  };

  const handleKabkot = (e) => {
    dispatch(kecamatan.fetchForAyah(e.target.value));
  };

  return (
    <Modal
      isOpen={toggleAyah}
      toggle={handleToggleAyah}
      size="lg"
      centered
      className="border-none"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
          <h3 className="text-lg sm:text-xl font-bold italic uppercase tracking-tight">
            Perbarui Data Ayah
          </h3>
          <button
            onClick={handleToggleAyah}
            className="hover:rotate-90 transition-transform text-2xl"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 max-h-[70vh] overflow-y-auto"
        >
          <FormGroup row className="items-center">
            <Label for="nama_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
              Nama Lengkap
            </Label>
            <Col md={9} xs={12}>
              <Field
                name="nama_ayah"
                component={InputBs}
                type="text"
                placeholder="Nama Lengkap Sesuai Dokumen"
              />
            </Col>
          </FormGroup>
          <FormGroup row className="items-center">
            <Label for="status_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
              Status Ayah
            </Label>
            <Col md={4} xs={6}>
              <Label check className="flex items-center space-x-2 cursor-pointer">
                <Field
                  name="status_ayah"
                  component={InputBs}
                  type="radio"
                  value="hidup"
                />{" "}
                <span className="text-sm font-medium">Hidup</span>
              </Label>
            </Col>
            <Col md={5} xs={6}>
              <Label check className="flex items-center space-x-2 cursor-pointer">
                <Field
                  name="status_ayah"
                  component={InputBs}
                  type="radio"
                  value="wafat"
                />{" "}
                <span className="text-sm font-medium">Wafat</span>
              </Label>
            </Col>
          </FormGroup>

          {status_ayah === "hidup" && (
            <div>
              <FormGroup row className="items-center">
                <Label for="nik_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  NIK
                </Label>
                <Col md={9} xs={12}>
                  <Field
                    name="nik_ayah"
                    component={InputBs}
                    type="text"
                    placeholder="Nomor Induk Kependudukan"
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="items-center">
                <Label for="file_scan_ktp_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  KTP Ayah
                </Label>
                <Col md={5} xs={12} className="mb-2 md:mb-0">
                  <Field
                    component={InputFileBs}
                    type="file"
                    className="form-control"
                    name="file_scan_ktp_ayah"
                    id="file_scan_ktp_ayah"
                  />
                </Col>
                {props.initialValues && props.initialValues.scan_ktp_ayah && (
                  <Col md={4} xs={12}>
                    <a
                      href={storage + "/" + props.initialValues.scan_ktp_ayah}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-block text-[10px] font-bold uppercase"
                    >
                      <i className="fa fa-file mr-2"></i> Lihat KTP Ayah
                    </a>
                  </Col>
                )}
              </FormGroup>
              <FormGroup row className="items-center">
                <Label md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  Lahir
                </Label>
                <Col md={5} xs={12} className="mb-2 md:mb-0">
                  <Field
                    name="tempat_lahir_ayah"
                    component={InputBs}
                    type="text"
                    placeholder="Tempat Lahir"
                  />{" "}
                </Col>
                <Col md={4} xs={12}>
                  <Field
                    name="tanggal_lahir_ayah"
                    component={InputDayPicker}
                    startYear={1950}
                    placeholder="Tanggal Lahir"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="alamat_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  Alamat
                </Label>
                <Col md={9} xs={12}>
                  <Field
                    name="alamat_ayah"
                    component={InputBs}
                    type="textarea"
                    rows="3"
                    placeholder="Alamat Lengkap Sesuai KTP"
                  />{" "}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="provinsi_ayah" md={3}>
                  Provinsi
                </Label>
                <Col md={9}>
                  <Field
                    name="provinsi_ayah"
                    component={InputBs}
                    type="select"
                    onChange={handleProvinsi}
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {Array.isArray(ref_provinsi_ayah) &&
                      ref_provinsi_ayah.map((data, key) => (
                        <option value={data.provinsi_id} key={key}>
                          {data.provinsi_nama}
                        </option>
                      ))}
                  </Field>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="kabkot_ayah" md={3}>
                  Kab/Kota
                </Label>
                <Col md={9}>
                  <Field
                    name="kabkot_ayah"
                    component={InputBs}
                    type="select"
                    onChange={handleKabkot}
                  >
                    <option value="">-- Pilih Kabupaten/Kota --</option>
                    {Array.isArray(ref_kabkot_ayah) &&
                      ref_kabkot_ayah.map((data, key) => (
                        <option value={data.kab_id} key={key}>
                          {data.kab_nama}
                        </option>
                      ))}
                  </Field>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="kecamatan_ayah" sm={3}>
                  Kecamatan
                </Label>
                <Col sm={9}>
                  <Field
                    name="kecamatan_ayah"
                    component={InputBs}
                    type="select"
                  >
                    <option value="">-- Pilih Kecamatan --</option>
                    {Array.isArray(ref_kecamatan_ayah) &&
                      ref_kecamatan_ayah.map((data, key) => (
                        <option value={data.kecam_id} key={key}>
                          {data.kecam_nama}
                        </option>
                      ))}
                  </Field>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="pekerjaan_ayah" md={3}>
                  Pekerjaan
                </Label>
                <Col md={9}>
                  <Field
                    type="select"
                    component={InputBs}
                    name="pekerjaan_ayah"
                    id="pekerjaan_ayah"
                  >
                    <option value="">-- Pilih Pekerjaan --</option>
                    {Array.isArray(ref_pekerjaan) &&
                      ref_pekerjaan.map((data, key) => (
                        <option value={data.kode} key={key}>
                          {data.nama}
                        </option>
                      ))}
                  </Field>
                </Col>
              </FormGroup>
              <FormGroup row className="items-center">
                <Label for="penghasilan_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  Penghasilan
                </Label>
                <Col md={5} xs={12}>
                  <Field
                    type="number"
                    component={InputBs}
                    name="penghasilan_ayah"
                    id="penghasilan_ayah"
                    placeholder="0"
                    validate={[money]}
                  />
                </Col>
                <Col md={4} xs={12} className="mt-2 md:mt-0">
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 font-bold text-center text-sm">
                    {rupiah(penghasilan_ayah)}
                  </div>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="sampingan_ayah" md={3}>
                  Sampingan
                </Label>
                <Col md={5} xs={12}>
                  <Field
                    type="number"
                    component={InputBs}
                    name="sampingan_ayah"
                    id="sampingan_ayah"
                    placeholder="Penghasilan Sampingan Ayah"
                  />
                  <FormText color="muted">
                    <ul className="list-reset">
                      <li>
                        Sampingan <b>per bulan</b>;
                      </li>
                      <li>Hanya isi dengan angka (0-9).</li>
                    </ul>
                  </FormText>
                </Col>
                <Col md={4} xs={12}>
                  <Alert color="success">{rupiah(sampingan_ayah)}</Alert>
                </Col>
              </FormGroup>
              <FormGroup row className="items-center">
                <Label for="file_scan_slip_ayah" md={3} xs={12} className="font-bold text-gray-600 text-[11px] uppercase tracking-wider">
                  Slip Gaji
                </Label>
                <Col md={5} xs={12} className="mb-2 md:mb-0">
                  <Field
                    component={InputFileBs}
                    type="file"
                    name="file_scan_slip_ayah"
                    id="file_scan_slip_ayah"
                  />
                </Col>
                {props.initialValues && props.initialValues.scan_slip_ayah && (
                  <Col md={4} xs={12}>
                    <a
                      href={storage + "/" + props.initialValues.scan_slip_ayah}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-block text-[10px] font-bold uppercase"
                    >
                      <i className="fa fa-file mr-2"></i> Lihat Slip Gaji
                    </a>
                  </Col>
                )}
              </FormGroup>
              <FormGroup row>
                <Label for="telepon_ayah" md={3}>
                  Nomor Telepon
                </Label>
                <Col md={9}>
                  <Field
                    name="telepon_ayah"
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

              <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t pt-6">
                <button
                  type="button"
                  onClick={handleToggleAyah}
                  className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700 transition order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pristine || submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-95 order-1 sm:order-2"
                >
                  <i className="fa fa-save mr-2"></i> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {status_ayah === "wafat" && (
            <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t pt-6">
              <button
                type="button"
                onClick={handleToggleAyah}
                className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700 transition order-2 sm:order-1"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={pristine || submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-95 order-1 sm:order-2"
              >
                <i className="fa fa-save mr-2"></i> Simpan Perubahan
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

class Ayah extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalToggle: false,
    };
  }

  componentDidMount() {
    const token = cookies.get(cookieName);
    this.props.dispatch(pekerjaan.fetchPekerjaan(token));
    this.props.dispatch(provinsi.fetchProvinsi());
    this.props.dispatch(
      ayah.fetchAllData(token, this.props.noPeserta, this.props.atribut),
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.ayah && prevProps.ayah !== this.props.ayah) {
      const data = this.props.ayah;
      if (data.provinsi_ayah) {
        this.props.dispatch(kabkot.fetchForAyah(data.provinsi_ayah));
      }
      if (data.kabkot_ayah) {
        this.props.dispatch(kecamatan.fetchForAyah(data.kabkot_ayah));
      }
    }
  }

  modalToggle = () => {
    this.setState({
      modalToggle: !this.state.modalToggle,
    });
  };

  submitAyah = (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key.startsWith("file_scan")) {
        if (values[key] && values[key][0]) {
          formData.append(key, values[key][0]);
          const fileInput = document.getElementById(key);
          if (fileInput) fileInput.value = null;
        }
      } else {
        let val = values[key];
        if (val instanceof Date || moment.isMoment(val)) {
          val = moment(val).format("YYYY-MM-DD");
        }
        // Ekstraksi value jika berupa object dari store referensi
        else if (val && typeof val === "object" && !Array.isArray(val)) {
          val =
            val.kode ||
            val.id ||
            val.provinsi_id ||
            val.kab_id ||
            val.kecam_id ||
            val;
        }
        formData.append(key, val === null || val === undefined ? "" : val);
      }
    }

    this.props
      .dispatch(
        ayah.updateData(
          cookies.get(cookieName),
          formData,
          this.props.noPeserta,
        ),
      )
      .then(() => {
        this.setState({ modalToggle: false });
        this.props.dispatch(
          ayah.fetchAllData(
            cookies.get(cookieName),
            this.props.noPeserta,
            this.props.atribut,
          ),
        );
        this.props.dispatch(reset("DataAyahSeleksi"));
      })
      .catch((err) => {
        console.error("Gagal mengupdate data ayah:", err);
      });
  };

  render() {
    const { ayah, location, editable } = this.props;
    const data = ayah || {};
    const isModeSanggah = editable;

    return (
      <div className="space-y-4">
        {isModeSanggah && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
            <i className="fa fa-info-circle mr-3 text-xl"></i>
            <span className="text-sm font-bold uppercase">
              Mode Sanggah Aktif: Anda dapat mengubah data ayah sekarang.
            </span>
          </div>
        )}

        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
          <div>
            <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <i className="fa fa-male text-emerald-600"></i> Data Ayah
            </h4>
            <p className="text-gray-500 text-sm">
              Informasi orang tua kandung / ayah.
            </p>
          </div>
          {isModeSanggah && (
            <button
              onClick={this.modalToggle}
              className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md"
            >
              <i className="fa fa-pencil mr-2"></i> Perbarui Data
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-emerald-50 flex items-center gap-2 font-bold">
            <i className="fa fa-user text-emerald-700"></i>
            <span className="uppercase text-gray-700 tracking-wider text-xs md:text-sm">
              Informasi Ayah
            </span>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr className="flex flex-col sm:table-row">
                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                  Nama Lengkap
                </td>
                <td className="p-4 font-medium text-gray-800 text-sm sm:text-base">
                  {data.nama_ayah || "-"}
                </td>
              </tr>
              <tr className="flex flex-col sm:table-row">
                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                  Status
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${data.status_ayah === "hidup" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {data.status_ayah || "Belum diisi"}
                  </span>
                </td>
              </tr>

              {data.status_ayah === "hidup" && (
                <>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      NIK
                    </td>
                    <td className="p-4 font-mono text-gray-700 text-sm sm:text-base">
                      {data.nik_ayah || "-"}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      KTP
                    </td>
                    <td className="p-4">
                      {data.scan_ktp_ayah ? (
                        <a
                          href={storage + "/" + data.scan_ktp_ayah}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm"
                        >
                          <i className="fa fa-download"></i> Lihat KTP
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          Belum diunggah
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Tempat, Tgl Lahir
                    </td>
                    <td className="p-4 text-gray-700 text-sm sm:text-base">
                      {data.tempat_lahir_ayah || data.tanggal_lahir_ayah ? (
                        <>
                          {data.tempat_lahir_ayah || "-"},{" "}
                          {dateConverter(data.tanggal_lahir_ayah)}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Alamat
                    </td>
                    <td className="p-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {data.provinsi
                        ? `${data.alamat_ayah || ""}, ${data.kecamatan ? data.kecamatan.kecam_nama : ""}, ${data.kabkot ? data.kabkot.kab_nama : ""}, ${data.provinsi.provinsi_nama}`
                        : data.alamat_ayah || "-"}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Pekerjaan
                    </td>
                    <td className="p-4 text-gray-700 text-sm sm:text-base">
                      {data.pekerjaan?.nama || "-"}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Penghasilan
                    </td>
                    <td className="p-4 font-bold text-emerald-700 text-sm sm:text-base">
                      {rupiah(data.penghasilan_ayah)}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        / bulan
                      </span>
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Penghasilan Sampingan
                    </td>
                    <td className="p-4 font-bold text-emerald-700 text-sm sm:text-base">
                      {rupiah(data.sampingan_ayah)}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        / bulan
                      </span>
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Bukti Penghasilan
                    </td>
                    <td className="p-4">
                      {data.scan_slip_ayah ? (
                        <a
                          href={storage + "/" + data.scan_slip_ayah}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm"
                        >
                          <i className="fa fa-download"></i> Lihat Slip Gaji
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          Belum diunggah
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-full sm:w-1/3 text-[10px] sm:text-xs uppercase">
                      Nomor Telepon
                    </td>
                    <td className="p-4 font-mono text-gray-700 text-sm sm:text-base">
                      {data.telepon_ayah || "-"}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <FormAyah
          onSubmit={this.submitAyah}
          initialValues={this.props.ayah}
          toggleAyah={this.state.modalToggle}
          handleToggleAyah={this.modalToggle}
        />
      </div>
    );
  }
}

FormAyah = reduxForm({
  form: "DataAyahSeleksi",
  enableReinitialize: true,
})(FormAyah);

const selector = formValueSelector("DataAyahSeleksi");

FormAyah = connect(
  (store) => {
    const { status_ayah, penghasilan_ayah, sampingan_ayah } = selector(
      store,
      "status_ayah",
      "penghasilan_ayah",
      "sampingan_ayah",
    );
    return {
      status_ayah,
      penghasilan_ayah,
      sampingan_ayah,
      ref_provinsi_ayah: store.provinsi.provinsi,
      ref_kabkot_ayah: store.kabkot.kabkot_ayah,
      ref_kecamatan_ayah: store.kecamatan.kecamatan_ayah,
      ref_pekerjaan: store.pekerjaan.pekerjaan,
    };
  },
  {
    kabkot,
    kecamatan,
  },
)(FormAyah);

export default withRouter(
  connect((store) => ({
    ayah: store.ayah.ayah,
  }))(Ayah),
);
