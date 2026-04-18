import React from "react";
import { SummaryCmahasiswa, DashboardChartMetadata } from "../components";
import { dashboard, admin } from "../../actions";
import { connect } from "react-redux";
import { cookies, cookieName, swal } from "../../global";
import { isAllowed } from "../../utils/rbac";
// Import sudah benar
import ButtonInject from "../../views/components/ButtonInject";

// STYLES: CSS-in-JS for Premium UI
const DashboardStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .trigger-pill-container {
            display: flex;
            align-items: center;
            background: white;
            border-radius: 20px;
            padding: 4px;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.1);
            position: relative;
            z-index: 50;
        }

        .select-year-custom {
            appearance: none;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); /* Same Emerald Gradient */
            border: none;
            padding: 10px 20px;
            font-size: 11px;
            font-weight: 900;
            color: white; /* Consistent white text */
            cursor: pointer;
            outline: none;
            border-radius: 16px 0 0 16px;
            transition: all 0.3s ease;
            min-width: 100px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-right: 1px solid rgba(255, 255, 255, 0.15); /* Subtle white divider */
        }

        .select-year-custom:hover {
            filter: brightness(1.1);
        }

        .select-jalur-custom {
            appearance: none;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            padding: 10px 30px; 
            font-size: 11px;
            font-weight: 900;
            color: white;
            cursor: pointer;
            outline: none;
            border-radius: 0; /* Seamless flow middle */
            box-shadow: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-right: 1px solid rgba(255, 255, 255, 0.15);
            position: relative;
            z-index: 2;
        }

        .select-flag-custom {
            appearance: none;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            padding: 10px 30px; 
            font-size: 11px;
            font-weight: 900;
            color: white;
            cursor: pointer;
            outline: none;
            border-radius: 0 16px 16px 0; /* End of pill */
            box-shadow: 10px 0 20px rgba(16, 185, 129, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 1;
        }

        .select-year-custom option,
        .select-jalur-custom option,
        .select-flag-custom option {
            color: #1e293b; 
            background: white;
            font-weight: 600;
        }

        .select-jalur-custom:disabled,
        .select-flag-custom:disabled {
            background: #f1f5f9;
            color: #cbd5e1;
            cursor: not-allowed;
            box-shadow: none;
            filter: grayscale(1);
            opacity: 0.6;
        }

        .select-jalur-custom:not(:disabled):hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }

        .select-jalur-custom:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
            filter: brightness(1.05);
        }

        .select-jalur-custom:active {
            transform: translateY(0);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .animate-premium {
            animation: fadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
    `,
    }}
  />
);

class Dashboards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      startDates: [],
      endDates: [],
      isModalOpen: false,
      modalTitle: "",
      selectedYear: "",
      selectedJalur: "",
      selectedFlag: "",
    };
  }

  handleTriggerChange = (field, value) => {
    this.setState({ [field]: value }, () => {
      const { selectedYear, selectedJalur, selectedFlag } = this.state;
      if (selectedYear && selectedJalur && selectedFlag) {
        // Sesuai permintaan: Hanya 2026 yang aktif, sisanya Coming Soon
        if (selectedYear === "2026") {
          const flagLabel =
            selectedFlag === "terima_ukt" ? "TERIMA UKT" : "PENGUMUMAN";
          swal({
            title: "Yakin Gasspol bro?",
            text: `Ubah semua mahasiswa ${selectedJalur} tahun ${selectedYear} jadi ${flagLabel}?`,
            icon: "warning",
            buttons: {
              cancel: "Nanti dulu",
              confirm: {
                text: "Ya, Sikat!",
                value: true,
              },
            },
            dangerMode: true,
          }).then((willProcess) => {
            if (willProcess) {
              this.props.dispatch(
                admin.triggerGlobalTerimaUKT(cookies.get(cookieName), {
                  year: selectedYear,
                  jalur: selectedJalur,
                  flag: selectedFlag,
                }),
              );
            }
          });
        } else {
          this.toggleModal(`Trigger ${selectedJalur} (${selectedYear})`);
        }

        // Reset setelah trigger agar bisa pilih lagi
        this.setState({
          selectedYear: "",
          selectedJalur: "",
          selectedFlag: "",
        });
      }
    });
  };

  toggleModal = (title = "") => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      modalTitle: title,
    });
  };

  componentDidMount() {
    // Initial fetch
    this.props.dispatch(dashboard.fetchData(cookies.get(cookieName)));

    // Real-time Update: Polling data grafik/chart setiap 30 detik
    this.pollingDashboard = setInterval(() => {
      this.props.dispatch(dashboard.fetchData(cookies.get(cookieName)));
    }, 60000);
  }

  componentWillUnmount() {
    // Hentikan polling agar tidak membebani server/browser
    if (this.pollingDashboard) clearInterval(this.pollingDashboard);
  }

  render() {
    return (
      /* Background utama dipastikan Putih */
      <div className="min-h-screen bg-white p-4 md:p-8 animate-premium">
        <DashboardStyles />
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Section 1: Top Statistics (Summary) */}
          <section>
            <SummaryCmahasiswa />
          </section>

          {/* Section 2: Konten Utama (Traffic) */}
          <section className="border-t border-gray-100 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                  Traffic Pengisian UKT New
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">
                  Monitoring aktivitas mahasiswa per fakultas secara real-time
                </p>
              </div>

              {/* Area Aksi: Ditambahkan ButtonInject di sini */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Tombol Inject Data - Hanya untuk Developer */}
                {isAllowed(this.props.user?.role, "INJECT_DATA") && (
                  <ButtonInject />
                )}

                {/* Grouped Trigger: Tahun & Jalur (Premium Layered UI - Clean Mode) - DIPROTEKSI RBAC */}
                {isAllowed(this.props.user?.role, "GLOBAL_TRIGGER") && (
                  <>
                    <div className="trigger-pill-container">
                      {/* Wrapper Tahun */}
                      <div className="relative">
                        <select
                          value={this.state.selectedYear}
                          onChange={(e) =>
                            this.handleTriggerChange(
                              "selectedYear",
                              e.target.value,
                            )
                          }
                          className="select-year-custom"
                        >
                          <option value="" disabled>
                            Tahun
                          </option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030">2030</option>
                        </select>
                      </div>

                      {/* Wrapper Jalur */}
                      <div className="relative">
                        <select
                          value={this.state.selectedJalur}
                          onChange={(e) =>
                            this.handleTriggerChange(
                              "selectedJalur",
                              e.target.value,
                            )
                          }
                          className="select-jalur-custom"
                          disabled={!this.state.selectedYear}
                        >
                          <option value="" disabled>
                            Pilih Jalur
                          </option>
                          <option
                            value="SNBP"
                            className="text-gray-800 bg-white"
                          >
                            SNBP
                          </option>
                          <option
                            value="SNBT"
                            className="text-gray-800 bg-white"
                          >
                            SNBT
                          </option>
                          <option
                            value="MANDIRI"
                            className="text-gray-800 bg-white"
                          >
                            MANDIRI
                          </option>
                        </select>
                      </div>

                      {/* Wrapper Flag (Pilihan Status) */}
                      <div className="relative">
                        <select
                          value={this.state.selectedFlag}
                          onChange={(e) =>
                            this.handleTriggerChange(
                              "selectedFlag",
                              e.target.value,
                            )
                          }
                          className="select-flag-custom"
                          disabled={
                            !this.state.selectedYear ||
                            !this.state.selectedJalur
                          }
                        >
                          <option value="" disabled>
                            Pilih Flag
                          </option>
                          <option
                            value="terima_ukt"
                            className="text-gray-800 bg-white italic"
                          >
                            TERIMA UKT
                          </option>
                          <option
                            value="pengumuman"
                            className="text-gray-800 bg-white italic"
                          >
                            PENGUMUMAN
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 hidden lg:block"></div>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">
                      Sistem Aktif
                    </span>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90"
                    title="Refresh Halaman"
                  >
                    <i className="fa fa-refresh text-base"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="w-full">
              <DashboardChartMetadata />
            </div>
          </section>

          {/* Section 3: Footer/Info Alert */}
          <footer className="pt-8 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3">
              <i className="fa fa-info-circle text-[#006d32] text-lg"></i>
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Catatan Admin:</strong> Data statistik ini diperbarui
                secara otomatis. Anda dapat menggunakan tombol{" "}
                <strong>Inject</strong> untuk mengunggah data mahasiswa baru
                dari file Excel ke sistem.
              </p>
            </div>
          </footer>
        </div>

        {/* Modal Coming Soon */}
        {this.state.isModalOpen && (
          <FormModal
            title={this.state.modalTitle}
            onClose={() => this.toggleModal()}
          />
        )}
      </div>
    );
  }
}

const FormModal = ({ onClose, title }) => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-md animate-fadeIn">
    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100 transition-all scale-100 outline-none">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-400 p-8 flex justify-between items-center text-white">
        <div>
          <h3 className="font-black uppercase tracking-widest text-base">
            {title || "Sistem Report"}
          </h3>
          <p className="text-[10px] opacity-80 mt-1 font-bold italic uppercase tracking-widest">
            Admin Control Panel
          </p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90 bg-black/5"
        >
          <i className="fa fa-times text-xl"></i>
        </button>
      </div>

      {/* Modal Body: Coming Soon State */}
      <div className="p-12 text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <i className="fa fa-sliders text-4xl text-emerald-500"></i>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-black text-emerald-900 uppercase italic">
            Under Development
          </h4>
          <p className="text-sm text-emerald-700/60 font-medium leading-relaxed px-5">
            Fitur trigger untuk sistem otomatis sedang dalam tahap integrasi
            engine. Mohon tunggu update selanjutnya bro!
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs shadow-xl shadow-emerald-600/20 tracking-[0.2em] transition-all active:scale-95 uppercase"
          >
            MENGERTI
          </button>
        </div>
      </div>

      {/* Modal Footer Decorative */}
      <div className="bg-emerald-50/50 p-4 text-center">
        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">
          Powered by SIUKAT-UNJ — 2026 Admin Panel
        </p>
      </div>
    </div>
  </div>
);

export default connect((store) => ({
  user: store.user.user,
  fields: store.dashboarddata.fields,
  startDates: store.dashboarddata.startDates,
  endDates: store.dashboarddata.endDates,
}))(Dashboards);
