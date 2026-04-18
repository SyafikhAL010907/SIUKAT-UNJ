import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Field, reduxForm, reset, formValueSelector, change } from "redux-form";
import { kendaraan as kendaraanAction } from "../../../../actions";
import { InputBs, money } from "../../../components";
import { cookies, cookieName, rupiah, storage } from "../../../../global";

// --- KOMPONEN PEMBANTU UNTUK INPUT FILE ---
// Ini adalah kunci untuk memperbaiki error "object no longer usable"
const BrowseFileInput = ({ input, label, accept, className }) => {
  // Kita buang properti 'value' dari input props karena browser
  // melarang setting value secara manual pada input type="file"
  const { value, ...inputProps } = input;

  return (
    <input
      {...inputProps}
      type="file"
      accept={accept}
      className={className}
      // Mengirim FileList ke Redux Store saat user memilih file
      onChange={(e) => input.onChange(e.target.files)}
    />
  );
};

// --- KOMPONEN MODAL FORM (FormKendaraan) ---
const selector = formValueSelector("DataKendaraanSeleksi");

let FormKendaraan = (props) => {
  const {
    handleSubmit,
    toggleKendaraan,
    handleToggleKendaraan,
    pristine,
    submitting,
    dispatch,
    status_motor,
    status_mobil,
    pajak_motor,
    pajak_mobil,
  } = props;

  if (!toggleKendaraan) return null;

  const handleStatusChange = (type, value) => {
    if (value === "tidak") {
      const prefix = type === "motor" ? "_motor" : "_mobil";
      dispatch(change("DataKendaraanSeleksi", `jumlah${prefix}`, 0));
      dispatch(change("DataKendaraanSeleksi", `pajak${prefix}`, 0));
      dispatch(change("DataKendaraanSeleksi", `file_scan${prefix}`, null));
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleToggleKendaraan}
      ></div>

      <div className="relative w-full max-w-3xl mx-auto z-50">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-0 max-h-[90vh] flex flex-col">
          <div className="bg-emerald-600 px-8 py-5 flex justify-between items-center text-white">
            <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <i className="fas fa-car-side"></i> Update Data Kendaraan
            </h3>
            <button
              onClick={handleToggleKendaraan}
              className="hover:rotate-90 transition-transform duration-300 text-3xl"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            id="form-kendaraan"
            className="p-8 overflow-y-auto space-y-10"
          >
            {/* SECTION MOTOR */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">
                  Data Sepeda Motor
                </span>
                <div className="h-px flex-grow bg-gray-100"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-4 font-bold text-gray-600 text-sm uppercase">
                  Kepemilikan Motor
                </label>
                <div className="md:col-span-8 flex gap-4">
                  {["ada", "tidak"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${status_motor === opt ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-100 text-gray-400"}`}
                    >
                      <Field
                        name="status_motor"
                        component="input"
                        type="radio"
                        value={opt}
                        onChange={(e) =>
                          handleStatusChange("motor", e.target.value)
                        }
                        className="hidden"
                      />
                      <span className="text-xs font-black uppercase">
                        {opt === "ada" ? "Ya, Ada" : "Tidak Ada"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {status_motor === "ada" && (
                <div className="bg-gray-50 p-6 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                        Jumlah Unit
                      </label>
                      <Field
                        name="jumlah_motor"
                        component={InputBs}
                        type="number"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                        Pajak Per Tahun
                      </label>
                      <div className="relative">
                        <Field
                          name="pajak_motor"
                          component={InputBs}
                          type="number"
                          validate={[money]}
                        />
                        <div className="mt-2 text-right font-bold text-emerald-600 text-xs">
                          {rupiah(pajak_motor || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                      Unggah STNK Motor (PDF)
                    </label>
                    <Field
                      name="file_scan_motor"
                      component={BrowseFileInput}
                      accept="application/pdf"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION MOBIL */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                  Data Mobil
                </span>
                <div className="h-px flex-grow bg-gray-100"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-4 font-bold text-gray-600 text-sm uppercase">
                  Kepemilikan Mobil
                </label>
                <div className="md:col-span-8 flex gap-4">
                  {["ada", "tidak"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${status_mobil === opt ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-100 text-gray-400"}`}
                    >
                      <Field
                        name="status_mobil"
                        component="input"
                        type="radio"
                        value={opt}
                        onChange={(e) =>
                          handleStatusChange("mobil", e.target.value)
                        }
                        className="hidden"
                      />
                      <span className="text-xs font-black uppercase">
                        {opt === "ada" ? "Ya, Ada" : "Tidak Ada"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {status_mobil === "ada" && (
                <div className="bg-gray-50 p-6 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                        Jumlah Unit
                      </label>
                      <Field
                        name="jumlah_mobil"
                        component={InputBs}
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                        Pajak Per Tahun
                      </label>
                      <Field
                        name="pajak_mobil"
                        component={InputBs}
                        type="number"
                        validate={[money]}
                      />
                      <div className="mt-2 text-right font-bold text-blue-600 text-xs">
                        {rupiah(pajak_mobil || 0)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                      Unggah STNK Mobil (PDF)
                    </label>
                    <Field
                      name="file_scan_mobil"
                      component={BrowseFileInput}
                      accept="application/pdf"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className="p-6 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleToggleKendaraan}
              className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-kendaraan"
              disabled={pristine || submitting}
              className="px-10 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <i className="fa fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fa fa-save mr-2"></i>
              )}
              Simpan Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FormKendaraan = reduxForm({
  form: "DataKendaraanSeleksi",
  enableReinitialize: true,
})(FormKendaraan);
FormKendaraan = connect((store) => ({
  status_motor: selector(store, "status_motor"),
  status_mobil: selector(store, "status_mobil"),
  pajak_motor: selector(store, "pajak_motor"),
  pajak_mobil: selector(store, "pajak_mobil"),
}))(FormKendaraan);

// --- KOMPONEN TAMPILAN UTAMA (Kendaraan) ---
class Kendaraan extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalToggle: false };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    return this.props.dispatch(
      kendaraanAction.getById(
        cookies.get(cookieName),
        this.props.noPeserta,
        this.props.atribut,
      ),
    );
  };

  modalToggle = () => {
    this.setState({ modalToggle: !this.state.modalToggle });
  };

  submitKendaraan = (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key.startsWith("file_scan")) {
        // Check if values[key] exists and is a FileList from our BrowseFileInput
        if (values[key] && values[key][0] instanceof File) {
          formData.append(key, values[key][0]);
        }
      } else {
        // Pastikan nilai null/undefined dikirim sebagai string kosong agar tidak error di backend
        formData.append(
          key,
          values[key] !== null && values[key] !== undefined ? values[key] : "",
        );
      }
    });

    return this.props
      .dispatch(
        kendaraanAction.updateData(
          cookies.get(cookieName),
          formData,
          this.props.noPeserta,
        ),
      )
      .then(() => {
        this.modalToggle();
        this.props.dispatch(reset("DataKendaraanSeleksi"));
        this.fetchData();
      });
  };

  renderTable(type, data) {
    const isMotor = type === "motor";
    const prefix = isMotor ? "motor" : "mobil";
    const status = data[`status_${prefix}`];
    const jumlah = data[`jumlah_${prefix}`];
    const pajak = data[`pajak_${prefix}`];
    const scan = data[`scan_${prefix}`];

    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full">
        <div
          className={`p-5 border-b border-gray-50 ${isMotor ? "bg-emerald-50/50" : "bg-blue-50/50"} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <i
              className={`fa ${isMotor ? "fa-motorcycle text-emerald-600" : "fa-car text-blue-600"} text-lg`}
            ></i>
            <span className="font-black uppercase text-gray-700 tracking-tighter text-sm">
              {isMotor ? "Sepeda Motor" : "Mobil"}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${status === "ada" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {status || "Belum diisi"}
          </span>
        </div>
        <div className="p-6">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-50">
              {status === "ada" ? (
                <>
                  <tr>
                    <td className="py-3 text-gray-400 font-bold uppercase w-1/2">
                      Jumlah Unit
                    </td>
                    <td className="py-3 text-right font-black text-gray-700">
                      {jumlah} Unit
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-400 font-bold uppercase">
                      Pajak / Thn
                    </td>
                    <td className="py-3 text-right font-black text-emerald-600">
                      {rupiah(pajak)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-400 font-bold uppercase">
                      Dokumen STNK
                    </td>
                    <td className="py-3 text-right">
                      {scan ? (
                        <a
                          href={`${storage}/${scan}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-black hover:underline"
                        >
                          LIHAT PDF
                        </a>
                      ) : (
                        <span className="text-gray-300 italic">Kosong</span>
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="py-8 text-center text-gray-400 italic font-medium"
                  >
                    Tidak memiliki kendaraan jenis ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    const { kendaraan: data, location, editable } = this.props;
    const isModeSanggah = editable;

    return (
      <div className="space-y-8">
        {isModeSanggah && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center text-amber-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping mr-3"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Akses Perubahan Data Dibuka
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-black text-gray-800 tracking-tighter uppercase italic">
              Data Kendaraan
            </h4>
            <p className="text-gray-400 text-xs font-medium">
              Informasi kepemilikan kendaraan operasional keluarga.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {this.renderTable("motor", data || {})}
          {this.renderTable("mobil", data || {})}
        </div>

        <FormKendaraan
          onSubmit={this.submitKendaraan}
          initialValues={data}
          toggleKendaraan={this.state.modalToggle}
          handleToggleKendaraan={this.modalToggle}
        />
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  kendaraan: store.kendaraan.kendaraan || {},
});

export default withRouter(connect(mapStateToProps)(Kendaraan));
