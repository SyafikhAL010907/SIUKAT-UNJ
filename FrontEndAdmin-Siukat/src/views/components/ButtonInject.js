import React from "react";
import swal from "sweetalert";
import { cookies, cookieName } from "../../global";

class ButtonInject extends React.Component {
  constructor(props) {
    super(props);
    // Menggunakan state ala Class Component
    this.state = {
      loading: false,
      progress: 0,
      statusMsg: "Menunggu File...",
    };
    this.fileInputRef = React.createRef();
    this.progressInterval = null;
  }

  startProgressSim = () => {
    this.setState({ progress: 0, statusMsg: "Membaca file Excel..." });
    const messages = [
      { p: 10, m: "Menganalisis 13 Sheet Data..." },
      { p: 25, m: "Validasi Struktur Tabel..." },
      { p: 40, m: "Proses Batch Hashing BCrypt (Keamanan)..." },
      { p: 60, m: "Injeksi tb_user & tb_cmahasiswa..." },
      { p: 75, m: "Sinkronisasi Jalur Masuk (SNBP)..." },
      { p: 85, m: "Menyelesaikan Transaksi Database..." },
      { p: 95, m: "Hampir Selesai, Tunggu Respon Server..." },
    ];

    let currentMsgIdx = 0;
    this.progressInterval = setInterval(() => {
      this.setState((prev) => {
        let newProgress = prev.progress + Math.random() * 2;
        if (newProgress > 95) newProgress = 95; // Stuck at 95 until server response

        let newMsg = prev.statusMsg;
        if (
          currentMsgIdx < messages.length &&
          newProgress >= messages[currentMsgIdx].p
        ) {
          newMsg = messages[currentMsgIdx].m;
          currentMsgIdx++;
        }

        return { progress: Math.round(newProgress), statusMsg: newMsg };
      });
    }, 200);
  };

  handleInject = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      swal({
        title: "Format Salah!",
        text: "Hanya file Excel (.xlsx atau .xls) yang diperbolehkan.",
        icon: "warning",
      });
      if (this.fileInputRef.current) this.fileInputRef.current.value = "";
      return;
    }

    const confirmInject = await swal({
      title: "Konfirmasi Injeksi!",
      text: `Peringatan: Anda akan menginject data dari file "${file.name}" ke sistem SIUKAT. Data lama mungkin tertimpa. Lanjutkan?`,
      icon: "warning",
      buttons: ["Batal", "Gaspol!"],
      dangerMode: true,
    });

    if (!confirmInject) {
      if (this.fileInputRef.current) this.fileInputRef.current.value = "";
      return;
    }

    // Start UI Animation
    this.setState({ loading: true });
    this.startProgressSim();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = cookies.get(cookieName);

      const response = await fetch(
        "http://localhost:8080/api/v1/admin/inject-data",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        clearInterval(this.progressInterval);
        this.setState({ progress: 100, statusMsg: "Berhasil! Data Disimpan." });

        setTimeout(() => {
          swal({
            title: "Success Hook!",
            text: "Berhasil! Data SNBP 2026 telah berhasil di-inject ke 13 Tabel dengan pengamanan BCrypt.",
            icon: "success",
          });
          this.setState({ loading: false, progress: 0 });
        }, 500);
      } else {
        clearInterval(this.progressInterval);
        swal({
          title: "Injeksi Gagal!",
          text:
            result.message ||
            "Terjadi kesalahan pada server saat memproses data.",
          icon: "error",
        });
        this.setState({ loading: false, progress: 0 });
      }
    } catch (error) {
      clearInterval(this.progressInterval);
      console.error("Error inject data:", error);
      swal({
        title: "Koneksi Terputus!",
        text: "Pastikan Backend Golang (Port 8080) aktif dan dapat dijangkau.",
        icon: "error",
      });
      this.setState({ loading: false, progress: 0 });
    } finally {
      if (this.fileInputRef.current) this.fileInputRef.current.value = "";
    }
  };

  render() {
    const { loading, progress, statusMsg } = this.state;

    return (
      <div className="flex items-center">
        {/* Progress Overlay Premium - Menggunakan Inline Style untuk memastikan Z-Index tertinggi */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(6, 78, 59, 0.4)", // bg-emerald-900/40
              backdropFilter: "blur(8px)", // backdrop-blur-sm
              padding: "1rem",
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-emerald-100 scale-100 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 relative">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                  <div
                    className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"
                    style={{ transition: "all 0.5s linear" }}
                  ></div>
                  {/* Inner percentage */}
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-700 font-bold text-2xl">
                    {progress}%
                  </div>
                </div>

                <h2 className="text-2xl font-black text-gray-800 mb-1 tracking-tight">
                  DATA INJECTION
                </h2>
                <p className="text-emerald-600 font-bold text-sm mb-8 flex items-center justify-center gap-2">
                  <i className="fa fa-refresh fa-spin"></i>
                  {statusMsg}
                </p>

                {/* Progress Bar Container */}
                <div className="w-full h-4 bg-emerald-50 rounded-full overflow-hidden mb-3 border border-emerald-100 p-0.5">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(5,150,105,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="w-full flex justify-between text-[11px] text-gray-400 font-black uppercase tracking-widest">
                  <span>Processing</span>
                  <span>{progress === 100 ? "Completed" : "Wait..."}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input file disembunyikan */}
        <input
          type="file"
          ref={this.fileInputRef}
          onChange={this.handleInject}
          accept=".xlsx, .xls"
          className="hidden"
        />

        {/* Tombol pemicu */}
        <button
          type="button"
          onClick={() => this.fileInputRef.current.click()}
          disabled={loading}
          className={`
            flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95
            ${
              loading
                ? "bg-gray-50 text-emerald-300 cursor-not-allowed border border-gray-100 opacity-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 active:shadow-inner"
            }
          `}
        >
          <i
            className={`fa ${loading ? "fa-spinner fa-spin" : "fa-database"} text-base`}
          ></i>
          <span>
            {loading ? "Processing Data..." : "Inject Data SNBP 2026"}
          </span>
        </button>
      </div>
    );
  }
}

export default ButtonInject;
