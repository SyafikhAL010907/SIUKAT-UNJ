import React from "react";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import { cookies, cookieName } from "../../global";

class ObjectMetaData extends React.Component {
  render() {
    const { title, valueFinished, valueFilling, valuetotal } = this.props;

    // Perhitungan Persentase dengan pengaman NaN
    const calcPercent = (val) =>
      valuetotal > 0 ? ((val / valuetotal) * 100).toFixed(1) : 0;

    const valueNotStarted = valuetotal - valueFilling - valueFinished;
    const percentNotStarted = calcPercent(valueNotStarted);
    const percentFilling = calcPercent(valueFilling);
    const percentFinished = calcPercent(valueFinished);

    return (
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        {/* Header Fakultas - Menggunakan Hijau UNJ pada Border Kiri */}
        <div className="bg-white px-6 py-4 border-b border-b-gray-100 flex justify-between items-center border-l-4 border-l-[#006d32]">
          <h3 className="text-lg font-bold text-[#006d32] tracking-tight">
            {title}
          </h3>
          <span className="text-sm font-bold text-gray-600 bg-gray-50 px-4 py-1 rounded-full border border-gray-200">
            Total: {valuetotal}{" "}
            <span className="text-[10px] uppercase ml-1 opacity-60">Mhs</span>
          </span>
        </div>

        <div className="p-6">
          {/* Multi-bar Progress - Warna UNJ */}
          <div className="flex w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-8 shadow-inner">
            {/* Belum Mengisi - Kuning UNJ */}
            <div
              style={{ width: `${percentNotStarted}%` }}
              className="bg-[#ffcc00] transition-all duration-700"
              title="Belum Mengisi"
            ></div>
            {/* Sedang Mengisi - Biru */}
            <div
              style={{ width: `${percentFilling}%` }}
              className="bg-blue-400 transition-all duration-700"
              title="Sedang Mengisi"
            ></div>
            {/* Selesai - Hijau UNJ */}
            <div
              style={{ width: `${percentFinished}%` }}
              className="bg-[#006d32] transition-all duration-700"
              title="Selesai"
            ></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status: Belum (Kuning) */}
            <div className="group p-4 rounded-xl bg-white border border-gray-100 hover:border-[#ffcc00]/50 transition-colors shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-[#ffcc00] mr-2 shadow-[0_0_8px_rgba(255,204,0,0.4)]"></div>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  Belum Mengisi
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-gray-800">
                  {valueNotStarted}
                </span>
                <span className="text-sm font-bold text-[#b89500]">
                  {percentNotStarted}%
                </span>
              </div>
            </div>

            {/* Status: Proses (Biru) */}
            <div className="group p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 shadow-[0_0_8px_rgba(96,165,250,0.4)]"></div>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  Sedang Mengisi
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-gray-800">
                  {valueFilling}
                </span>
                <span className="text-sm font-bold text-blue-500">
                  {percentFilling}%
                </span>
              </div>
            </div>

            {/* Status: Selesai (Hijau UNJ) */}
            <div className="group p-4 rounded-xl bg-[#006d32]/5 border border-[#006d32]/10 hover:border-[#006d32]/30 transition-colors shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-[#006d32] mr-2 shadow-[0_0_8px_rgba(0,109,50,0.3)]"></div>
                <span className="text-[11px] text-[#006d32]/70 font-bold uppercase tracking-widest">
                  Selesai Isi
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-[#006d32]">
                  {valueFinished}
                </span>
                <span className="text-sm font-bold text-[#006d32]/80">
                  {percentFinished}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class DashboardChartMetadata extends React.Component {
  componentDidMount() {
    this.props.dispatch(dashboard.fetchMeta(cookies.get(cookieName)));
  }

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#006d32]"></div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Memuat Data Fakultas...
          </span>
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Dashboard Legend Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Status Pengisian UKT
            </h2>
            <p className="text-sm text-gray-400 font-medium italic">
              Data statistik pengisian berdasarkan Fakultas
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <div className="w-2.5 h-2.5 bg-[#ffcc00] rounded-sm mr-2"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                Belum Mengisi
              </span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm mr-2"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                Sedang Mengisi
              </span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <div className="w-2.5 h-2.5 bg-[#006d32] rounded-sm mr-2"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                Selesai Isi
              </span>
            </div>
          </div>
        </div>

        {/* List Fakultas */}
        <div className="space-y-1">
          {data.map((d, index) => (
            <ObjectMetaData
              key={index}
              title={d.fakultas}
              valueFinished={d.countSelesai}
              valueFilling={d.countPengisian}
              valuetotal={d.countAll}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect((store) => ({
  data: store.dashboarddata.meta.data,
}))(DashboardChartMetadata);
