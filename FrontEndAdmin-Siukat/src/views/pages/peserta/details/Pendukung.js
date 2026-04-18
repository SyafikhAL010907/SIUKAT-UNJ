import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Field, reduxForm, reset, formValueSelector } from "redux-form";
import { pendukung } from "../../../../actions";
import { InputBs, InputFileBs } from "../../../components";
import { cookies, cookieName, storage } from "../../../../global";

// Deklarasi selector di luar untuk mencegah error undefined
const selector = formValueSelector("DataPendukungSeleksi");

/**
 * KOMPONEN: FormPendukung (Modal Form)
 */
let FormPendukung = (props) => {
  const {
    handleSubmit,
    handleTogglePendukung,
    togglePendukung,
    pristine,
    submitting,
    initialValues,
  } = props;

  if (!togglePendukung) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleTogglePendukung}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl mx-auto z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-emerald-600 rounded-t-xl text-white">
            <h3 className="text-lg font-bold italic uppercase tracking-tight flex items-center">
              <i className="fa fa-users mr-3 text-yellow-300"></i> Perbarui Berkas Pendukung
            </h3>
            <button
              className="text-white hover:rotate-90 text-2xl font-bold transition-transform"
              onClick={handleTogglePendukung}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="relative p-6 flex-auto">
            <form
              onSubmit={handleSubmit}
              id="form-pendukung"
              className="space-y-6"
            >
              {/* Jumlah Tanggungan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
                <label className="text-sm font-semibold text-gray-700 pt-2">
                  Jumlah Tanggungan
                </label>
                <div className="md:col-span-2">
                  <Field
                    name="tanggungan"
                    component="input"
                    type="number"
                    placeholder="Contoh: 4"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm font-medium"
                  />
                  <p className="mt-2 text-[11px] text-gray-500 italic">
                    * Jumlah seluruh anggota keluarga yang menjadi tanggung
                    jawab (termasuk Kepala Keluarga).
                  </p>
                </div>
              </div>

              {/* Upload Kartu Keluarga */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start border-t pt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Kartu Keluarga (KK)
                </label>
                <div className="md:col-span-2 space-y-4">
                  <Field
                    name="file_scan_kk"
                    component={InputFileBs}
                    type="file"
                    id="file_scan_kk"
                  />

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <ul className="text-[11px] text-yellow-700 space-y-1 list-disc ml-4 font-medium uppercase tracking-tight">
                      <li>
                        Ekstensi berkas wajib <b>PDF</b>
                      </li>
                      <li>
                        Ukuran berkas maksimal <b>500 KB</b>
                      </li>
                    </ul>
                  </div>

                  {initialValues?.scan_kk && (
                    <a
                      href={`${storage}/${initialValues.scan_kk}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      <i className="fa fa-file-pdf-o mr-2"></i> Lihat Kartu
                      Keluarga Saat Ini
                    </a>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end p-6 border-t bg-gray-50 rounded-b-xl gap-3">
            <button
              onClick={handleTogglePendukung}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition order-2 sm:order-1"
            >
              BATAL
            </button>
            <button
              type="submit"
              form="form-pendukung"
              disabled={pristine || submitting}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 order-1 sm:order-2"
            >
              {submitting ? (
                <i className="fa fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fa fa-save mr-2"></i>
              )}
              SIMPAN PERUBAHAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FormPendukung = reduxForm({
  form: "DataPendukungSeleksi",
  enableReinitialize: true,
})(FormPendukung);

// Menghubungkan selector untuk mendapatkan nilai scan_kk jika diperlukan di form
FormPendukung = connect((store) => {
  return {
    scan_kk: selector(store, "scan_kk"),
  };
})(FormPendukung);

/**
 * KOMPONEN UTAMA: Pendukung
 */
class Pendukung extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalToggle: false };
  }

  componentDidMount() {
    this.props.dispatch(
      pendukung.getById(
        cookies.get(cookieName),
        this.props.noPeserta,
        this.props.atribut,
      ),
    );

    // Otomatis buka modal jika navigasi datang dari button "Sanggah" di DataTable
    const { location } = this.props;
    if (location.state && location.state.modeEdit) {
      // setTimeout(() => {
      //     this.setState({ modalToggle: true });
      // }, 800);
    }
  }

  modalToggle = () => {
    this.setState({ modalToggle: !this.state.modalToggle });
  };

  submitPendukung = (values) => {
    this.modalToggle();
    const formData = new FormData();
    for (let key in values) {
      if (key.startsWith("file_scan") && values[key] && values[key][0]) {
        formData.append(key, values[key][0]);
        const el = document.getElementById(key);
        if (el) el.value = null;
      } else {
        formData.append(key, values[key]);
      }
    }
    this.props
      .dispatch(
        pendukung.updateData(
          cookies.get(cookieName),
          formData,
          this.props.noPeserta,
        ),
      )
      .then(() => {
        this.modalToggle();
        // Refetch data agar tampilan InfoItem langsung terupdate
        this.props.dispatch(
          pendukung.getById(
            cookies.get(cookieName),
            this.props.noPeserta,
            this.props.atribut,
          ),
        );
      });
    this.props.dispatch(reset("DataPendukungSeleksi"));
  };

  render() {
    const { pendukung, location, editable } = this.props;
    const isModeSanggah = editable;

    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Banner Mode Sanggah */}
        {isModeSanggah && (
          <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center text-orange-700 animate-pulse">
            <i className="fa fa-info-circle mr-3 text-xl"></i>
            <span className="text-sm font-bold uppercase">
              Mode Sanggah Aktif: Anda dapat mengubah berkas pendukung sekarang.
            </span>
          </div>
        )}

        {/* Header Card */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg shadow-inner">
              <i className="fa fa-file-text-o text-white"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 tracking-tight italic uppercase">
              Berkas Pendukung
            </h4>
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

        {/* Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
              <tr className="flex flex-col sm:table-row hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px] tracking-widest">
                  Jumlah Tanggungan
                </td>
                <td className="px-6 py-4 text-gray-800 sm:border-l border-gray-50 text-sm sm:text-base">
                  <span className="text-lg font-bold text-green-700">
                    {pendukung.tanggungan || 0}
                  </span>
                  <span className="ml-2 text-gray-400 font-medium italic">
                    Orang
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col sm:table-row hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px] tracking-widest">
                  Kartu Keluarga
                </td>
                <td className="px-6 py-4 sm:border-l border-gray-50">
                  {pendukung.scan_kk ? (
                    <a
                      href={`${storage}/${pendukung.scan_kk}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-[11px] font-bold rounded-lg shadow transition w-full sm:w-auto justify-center"
                    >
                      <i className="fa fa-download mr-2"></i> UNDUH / LIHAT KK
                    </a>
                  ) : (
                    <div className="flex items-center text-red-500 text-[10px] sm:text-xs font-bold italic bg-red-50 px-3 py-1 rounded-full w-fit">
                      <i className="fa fa-warning mr-2"></i> Belum ada dokumen
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Form Component */}
        <FormPendukung
          onSubmit={this.submitPendukung}
          initialValues={this.props.pendukung}
          togglePendukung={this.state.modalToggle}
          handleTogglePendukung={this.modalToggle}
        />
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  pendukung: store.pendukung.pendukung || {},
});

export default withRouter(connect(mapStateToProps)(Pendukung));
