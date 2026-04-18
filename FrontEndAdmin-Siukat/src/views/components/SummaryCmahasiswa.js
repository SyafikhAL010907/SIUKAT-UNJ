import React from "react";
import { cmahasiswa } from "../../actions";
import { connect } from "react-redux";
import { cookies, cookieName } from "../../global";

class SummaryCmahasiswa extends React.Component {
  componentDidMount() {
    // Initial fetch
    this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)));

    // Real-time Update: Polling setiap 10 detik agar data dashboard selalu segar
    this.pollingStats = setInterval(() => {
      this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)));
    }, 60000);
  }

  componentWillUnmount() {
    // Hentikan polling saat pindah halaman biar nggak berat
    if (this.pollingStats) clearInterval(this.pollingStats);
  }

  /**
   * Fungsi Helper untuk merender Card
   * Menambahkan pengecekan isNaN agar tidak muncul NaN% di UI
   */
  renderCard(
    title,
    count,
    percentage,
    smallText,
    icon,
    colorClass,
    barColor,
    textColor = "text-white",
  ) {
    // LOGIKA PERBAIKAN: Jika percentage bukan angka (NaN), null, atau undefined, set ke 0
    const safePercentage =
      isNaN(percentage) || percentage === null || percentage === undefined
        ? 0
        : Math.round(percentage);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-xl hover:-translate-y-1.5 group">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {count || 0}
            </h3>
          </div>
          <div
            className={`p-3.5 rounded-2xl ${colorClass} ${textColor} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}
          >
            <i className={`fa ${icon} text-2xl`}></i>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-700">
                {safePercentage}%
              </span>
              <span className="text-gray-400 font-semibold uppercase tracking-wider opacity-60">
                Progres
              </span>
            </div>
            <span className="text-gray-400 font-medium italic">
              {smallText}
            </span>
          </div>

          {/* Progress Bar Area - More Modern */}
          <div className="w-full bg-slate-100/50 rounded-full h-2.5 p-0.5 overflow-hidden ring-1 ring-inset ring-black/5">
            <div
              className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
              style={{ width: `${safePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // Memastikan flagCount memiliki objek default agar tidak error saat akses property
    const flagCount = this.props.flagCount || {};

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 p-1">
        {/* Card 1: Status Pengisian */}
        {this.renderCard(
          "Selesai Mengisi",
          flagCount.total_selesai,
          flagCount.percentSelesai,
          `Sisa: ${flagCount.total_belum || 0}`,
          "fa-check-circle",
          "bg-gradient-to-br from-emerald-600 to-teal-500",
          "bg-emerald-500",
        )}

        {/* Card 2: UKT Tinggi */}
        {this.renderCard(
          "UKT Tinggi",
          flagCount.ukt_tinggi,
          flagCount.percentUktTinggi,
          `Seleksi: ${flagCount.ukt_seleksi || 0}`,
          "fa-line-chart",
          "bg-gradient-to-br from-amber-400 to-orange-400",
          "bg-amber-400",
        )}

        {/* Card 3: Terima UKT */}
        {this.renderCard(
          "Terima UKT",
          flagCount.terima_ukt,
          flagCount.percentTerima,
          `Antre: ${flagCount.pengumuman || 0}`,
          "fa-handshake-o",
          "bg-gradient-to-br from-sky-500 to-indigo-500",
          "bg-sky-500",
        )}

        {/* Card 4: Sanggah UKT */}
        {this.renderCard(
          "Selesai Sanggah",
          flagCount.selesai_sanggah,
          flagCount.percentSanggah,
          `Total: ${flagCount.sanggah_ukt || 0}`,
          "fa-gavel",
          "bg-gradient-to-br from-rose-500 to-pink-500",
          "bg-rose-500",
        )}
      </div>
    );
  }
}

// Map State dari Redux
const mapStateToProps = (store) => ({
  flagCount: store.cmahasiswa.flagCount,
});

export default connect(mapStateToProps)(SummaryCmahasiswa);
