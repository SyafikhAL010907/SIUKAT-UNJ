import React from "react";
import { connect } from "react-redux";
import { info, user } from "../../../actions";
import { Field, reduxForm, reset } from "redux-form";
import { InputBs, InputDayPicker } from "../../components";
import { cookies, cookieName } from "../../../global";
import { isAllowed } from "../../../utils/rbac";

// Komponen Form Jadwal UKT Modern
let FormJadwalUkt = (props) => {
  const { handleSubmit, pristine, submitting, canEdit } = props;
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Kolom Kiri: Pengaturan Akses Login (Wadah Baru) */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <i className="fa fa-lock text-emerald-600"></i>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Akses & Kontak Seleksi
            </h4>
          </div>

          <div className="space-y-4">
            <Field name="kode" component="input" type="hidden" />

            {/* Box Read-Only untuk Verifikasi DB */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Status Database (Jalur)
              </label>
              <Field
                name="stage"
                component={InputBs}
                type="text"
                readOnly
                className="w-full bg-white/50 px-4 py-2 rounded-xl border border-gray-100 text-gray-500 font-bold uppercase text-sm outline-none cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-xs font-bold uppercase text-emerald-700 m-0">
                    Tanggal Mulai Login
                  </label>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => props.change("tanggal_mulai", "")}
                      className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors flex items-center"
                    >
                      <i className="fa fa-refresh mr-1"></i> RESET
                    </button>
                  )}
                </div>
                <Field
                  name="tanggal_mulai"
                  component={InputDayPicker}
                  placeholder="Pilih Tanggal Mulai"
                  disabled={!canEdit}
                  className="modern-date-input w-full px-4 py-2.5 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-emerald-50/30"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-xs font-bold uppercase text-red-700 m-0">
                    Tanggal Selesai Login (Tutup)
                  </label>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => props.change("tanggal_selesai", "")}
                      className="text-[10px] font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center"
                    >
                      <i className="fa fa-refresh mr-1"></i> RESET
                    </button>
                  )}
                </div>
                <Field
                  name="tanggal_selesai"
                  component={InputDayPicker}
                  placeholder="Pilih Tanggal Selesai"
                  disabled={!canEdit}
                  className="modern-date-input w-full px-4 py-2.5 rounded-xl border border-red-100 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-red-50/30"
                />
              </div>

              <div className="pt-2 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-xs font-bold text-emerald-600 uppercase m-0">
                    Tanggal Akhir (Masa Perpanjangan)
                  </label>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => props.change("tanggal_akhir", "")}
                      className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors flex items-center"
                    >
                      <i className="fa fa-refresh mr-1"></i> RESET
                    </button>
                  )}
                </div>
                <Field
                  name="tanggal_akhir"
                  component={InputDayPicker}
                  placeholder="Isi untuk masa perpanjangan"
                  disabled={!canEdit}
                  className="modern-date-input w-full px-4 py-2.5 rounded-xl border-dashed border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-emerald-50/10"
                />
                <p className="text-[10px] text-gray-400 mt-1 ml-1">
                  *Jika diisi, mahasiswa tetap bisa login meskipun Tanggal
                  Selesai sudah lewat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Timeline Administrasi */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <i className="fa fa-calendar-check-o text-emerald-600"></i>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Timeline Administrasi
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 group">
              <div className="flex items-center space-x-2 mb-1.5 ml-1">
                <i className="fa fa-pencil-square-o text-emerald-500"></i>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide">
                  Periode Pengisian Data
                </label>
              </div>
              <Field
                name="pengisian"
                component={InputBs}
                type="text"
                placeholder="Contoh: 1 - 10 Maret 2024"
                disabled={!canEdit}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm group-hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              />
            </div>

            <div className="sm:col-span-2 group">
              <div className="flex items-center space-x-2 mb-1.5 ml-1">
                <i className="fa fa-bullhorn text-emerald-500"></i>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide">
                  Tanggal Pengumuman UKT
                </label>
              </div>
              <Field
                name="pengumuman"
                component={InputBs}
                type="text"
                placeholder="Contoh: 20 Maret 2024"
                disabled={!canEdit}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm group-hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              />
            </div>

            <div className="group">
              <div className="flex items-center space-x-2 mb-1.5 ml-1">
                <i className="fa fa-map-marker text-emerald-500"></i>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide">
                  Batas Lapor Diri
                </label>
              </div>
              <Field
                name="lapor_diri"
                component={InputBs}
                type="text"
                placeholder="25 Maret 2024"
                disabled={!canEdit}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm group-hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              />
            </div>

            <div className="group">
              <div className="flex items-center space-x-2 mb-1.5 ml-1">
                <i className="fa fa-credit-card text-emerald-500"></i>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide">
                  Batas Pembayaran
                </label>
              </div>
              <Field
                name="pembayaran"
                component={InputBs}
                type="text"
                placeholder="30 Maret 2024"
                disabled={!canEdit}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm group-hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Simpan Terintegrasi - Pindah ke Bawah Tengah - DIPROTEKSI RBAC */}
      {canEdit && (
        <div className="pt-10 flex justify-center border-t border-gray-100">
          <div className="w-full max-w-md">
            <button
              type="submit"
              disabled={pristine || submitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-3 active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <i className="fa fa-save text-xl group-hover:rotate-12 transition-transform"></i>
              <span className="uppercase tracking-widest">
                Simpan Perubahan Jadwal
              </span>
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 italic">
              *Perubahan ini akan langsung berdampak pada seluruh akses sistem
              mahasiswa.
            </p>
          </div>
        </div>
      )}
    </form>
  );
};
class JadwalUkt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKode: 1, // Default ke SNMPTN
    };
  }

  componentDidMount() {
    this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)));
    this.props.dispatch(info.fetchInfo(this.state.selectedKode));
  }

  handleStageChange = (e) => {
    const kode = e.target.value;
    this.setState({ selectedKode: kode });
    this.props.dispatch(info.fetchInfo(kode));
  };

  submitForm = (values) => {
    // Pastikan kode terikut saat save
    const payload = { ...values, kode: parseInt(this.state.selectedKode) };
    this.props.dispatch(info.updateData(cookies.get(cookieName), payload));
  };

  formatDateForInput = (dateStr) => {
    if (!dateStr) return "";

    // Handle case where dateStr is a number (timestamp)
    if (typeof dateStr === "number") {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    if (typeof dateStr === "string" && dateStr.startsWith("0000")) return "";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    // Ambil komponen tanggal lokal (biar nggak kegeser 7 jam ke belakang sama UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  render() {
    // Transform dates for form display if they exist
    const canEdit = isAllowed(this.props.user?.role, "EDIT_DATA");
    const formattedInitialValues = {
      ...this.props.info,
      tanggal_mulai: this.formatDateForInput(this.props.info?.tanggal_mulai),
      tanggal_selesai: this.formatDateForInput(
        this.props.info?.tanggal_selesai,
      ),
      tanggal_akhir: this.formatDateForInput(this.props.info?.tanggal_akhir),
    };

    return (
      <div className="p-4 md:p-8 space-y-10">
        <div className="modern-card">
          {/* Header Page Premium dengan Glass Effect */}
          <div className="glass-header flex flex-col md:flex-row md:items-center justify-between gap-6 border-none rounded-none">
            <div className="flex items-center space-x-5 text-emerald-900">
              <div className="p-4 bg-white/40 rounded-2xl backdrop-blur-md shadow-inner border border-white/50">
                <i className="fa fa-calendar-check-o text-3xl text-emerald-600"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Pengaturan Jadwal UKT
                </h2>
                <p className="text-emerald-700/70 text-sm font-medium">
                  Kelola periode pengisian, klarifikasi, dan pembayaran
                </p>
              </div>
            </div>

            {/* Dropdown Jalur Sejajar Header - Premium Style */}
            <div className="flex items-center space-x-4 bg-white/30 p-2.5 rounded-2xl backdrop-blur-xl border border-white/50 shadow-sm">
              <span className="text-emerald-900 text-[10px] font-black uppercase ml-2 hidden sm:inline tracking-widest">
                Pilih Jalur:
              </span>
              <select
                value={this.state.selectedKode}
                onChange={this.handleStageChange}
                disabled={!canEdit}
                className="bg-white text-emerald-800 text-sm font-bold px-6 py-2 rounded-xl outline-none border-none focus:ring-2 focus:ring-yellow-400 transition-all cursor-pointer shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <option value="1">SNBP</option>
                <option value="2">SNBT</option>
                <option value="3">MANDIRI</option>
              </select>
            </div>
          </div>

          <div className="p-10">
            <FormJadwalUkt
              canEdit={isAllowed(this.props.user?.role, "EDIT_DATA")}
              onSubmit={this.submitForm}
              initialValues={formattedInitialValues}
            />
          </div>
        </div>
      </div>
    );
  }
}

FormJadwalUkt = reduxForm({
  form: "DataJadwalUkt",
  enableReinitialize: true,
})(FormJadwalUkt);

export default connect((store) => ({
  info: store.info.info,
  user: store.user.user,
}))(JadwalUkt);
