import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Field, reduxForm, reset, formValueSelector } from "redux-form";
import { listrik } from "../../../../actions";
import { InputBs, InputFileBs, money } from "../../../components";
import { cookies, cookieName, rupiah, storage } from "../../../../global";

// 1. Deklarasikan selector DI LUAR komponen agar tersedia saat connect dipanggil
const selector = formValueSelector("DataListrikSeleksi");

/**
 * KOMPONEN: FormListrik (Modal Form)
 */
let FormListrik = (props) => {
  const {
    handleSubmit,
    handleToggleListrik,
    toggleListrik,
    pristine,
    submitting,
    initialValues,
    pengeluaran,
  } = props;

  if (!toggleListrik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleToggleListrik}
      ></div>

      <div className="relative w-full max-w-2xl mx-auto z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
          <div className="flex items-center justify-between p-4 border-b bg-emerald-600 rounded-t-xl text-white">
            <h3 className="text-lg font-bold italic uppercase tracking-tight flex items-center">
              <i className="fa fa-bolt mr-3 text-yellow-300"></i> Perbarui Data Listrik
            </h3>
            <button
              className="text-white hover:rotate-90 text-2xl font-bold transition-transform"
              onClick={handleToggleListrik}
            >
              ×
            </button>
          </div>

          <div className="relative p-6 flex-auto max-h-[75vh] overflow-y-auto">
            <form
              onSubmit={handleSubmit}
              id="form-listrik"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center">
                <label className="text-sm font-semibold text-gray-700">
                  Nomor Pelanggan
                </label>
                <div className="md:col-span-2">
                  <Field
                    name="no_pelanggan"
                    component="input"
                    type="text"
                    placeholder="Nomor Pelanggan PLN"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pt-2">
                  Status Listrik
                </label>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition">
                    <Field
                      name="jenis_pemakaian"
                      component="input"
                      type="radio"
                      value="prabayar"
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Prabayar
                    </span>
                  </label>
                  <label className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition">
                    <Field
                      name="jenis_pemakaian"
                      component="input"
                      type="radio"
                      value="pascabayar"
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Pascabayar
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
                <label className="text-sm font-semibold text-gray-700 pt-2">
                  Biaya Listrik
                </label>
                <div className="md:col-span-2 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Field
                        name="pengeluaran"
                        component="input"
                        type="number"
                        validate={[money]}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                    </div>
                    <div className="sm:w-1/2 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg border border-green-200 font-bold text-center text-sm">
                      {rupiah(pengeluaran || 0)}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-[11px] text-blue-700 italic">
                    * Masukkan rata-rata biaya 3 bulan terakhir.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start border-t pt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Bukti Tagihan
                </label>
                <div className="md:col-span-2 space-y-4">
                  <Field
                    name="file_scan_listrik"
                    component={InputFileBs}
                    type="file"
                    id="file_scan_listrik"
                  />
                  {initialValues?.scan_listrik && (
                    <a
                      href={`${storage}/${initialValues.scan_listrik}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      <i className="fa fa-file-pdf-o mr-2"></i> Lihat Dokumen
                      Lama
                    </a>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end p-6 border-t bg-gray-50 rounded-b-xl gap-3">
            <button
              onClick={handleToggleListrik}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition order-2 sm:order-1"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-listrik"
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

// 2. Bungkus dengan reduxForm TERLEBIH DAHULU
FormListrik = reduxForm({
  form: "DataListrikSeleksi",
  enableReinitialize: true,
})(FormListrik);

// 3. Kemudian hubungkan ke connect menggunakan selector
FormListrik = connect((store) => {
  // Pastikan selector dipanggil dengan state store
  const pengeluaran = selector(store, "pengeluaran");
  return {
    pengeluaran: pengeluaran,
  };
})(FormListrik);

/**
 * KOMPONEN UTAMA
 */
class Listrik extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalToggle: false };
  }

  componentDidMount() {
    this.props.dispatch(
      listrik.getById(
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

  submitListrik = (values) => {
    this.modalToggle();
    const formData = new FormData();
    for (let key in values) {
      if (key.startsWith("file_scan") && values[key] && values[key][0]) {
        formData.append(key, values[key][0]);
      } else {
        formData.append(key, values[key]);
      }
    }
    this.props
      .dispatch(
        listrik.updateData(
          cookies.get(cookieName),
          formData,
          this.props.noPeserta,
        ),
      )
      .then(() => {
        this.modalToggle();
        // Refetch data agar tampilan InfoItem langsung terupdate
        this.props.dispatch(
          listrik.getById(
            cookies.get(cookieName),
            this.props.noPeserta,
            this.props.atribut,
          ),
        );
      });
    this.props.dispatch(reset("DataListrikSeleksi"));
  };

  render() {
    const { listrik, location, editable } = this.props;
    const isModeSanggah = editable;

    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Banner Mode Sanggah */}
        {isModeSanggah && (
          <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center text-orange-700 animate-pulse">
            <i className="fa fa-info-circle mr-3 text-xl"></i>
            <span className="text-sm font-bold uppercase">
              Mode Sanggah Aktif: Anda dapat mengubah data listrik sekarang.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-400 rounded-lg">
              <i className="fa fa-bolt text-white"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-800 tracking-tight italic uppercase">
              Data Listrik
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100">
              <tr className="flex flex-col sm:table-row">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px]">
                  Nomor Pelanggan
                </td>
                <td className="px-6 py-4 text-gray-800 sm:border-l border-gray-50 font-mono italic text-sm sm:text-base">
                  {listrik.no_pelanggan || "-"}
                </td>
              </tr>
              <tr className="flex flex-col sm:table-row">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px]">
                  Jenis Pemakaian
                </td>
                <td className="px-6 py-4 text-gray-800 sm:border-l border-gray-50">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[11px] font-bold uppercase">
                    {listrik.jenis_pemakaian || "-"}
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col sm:table-row">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px]">
                  Biaya Listrik
                </td>
                <td className="px-6 py-4 text-green-700 font-bold sm:border-l border-gray-50 text-sm sm:text-base">
                  {rupiah(listrik.pengeluaran)}{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    / 3 bln
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col sm:table-row">
                <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30 w-full sm:w-1/3 uppercase text-[10px]">
                  Dokumen
                </td>
                <td className="px-6 py-4 sm:border-l border-gray-50">
                  {listrik.scan_listrik ? (
                    <a
                      href={`${storage}/${listrik.scan_listrik}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold rounded w-full sm:w-auto justify-center"
                    >
                      <i className="fa fa-file-pdf-o mr-2"></i> LIHAT STRUK
                    </a>
                  ) : (
                    <span className="text-red-400 italic text-[10px] sm:text-xs">
                      Belum ada berkas
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <FormListrik
          onSubmit={this.submitListrik}
          initialValues={this.props.listrik}
          toggleListrik={this.state.modalToggle}
          handleToggleListrik={this.modalToggle}
        />
      </div>
    );
  }
}

// Map store state to Listrik props
const mapStateToProps = (store) => ({
  listrik: store.listrik.listrik || {},
});

export default withRouter(connect(mapStateToProps)(Listrik));
