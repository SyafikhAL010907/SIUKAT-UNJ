import React from 'react';
import { cmahasiswa } from '../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName } from '../../global';

class SummaryCmahasiswa extends React.Component {
    componentDidMount() {
        // Initial fetch
        this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)));

        // Real-time Update: Polling setiap 10 detik agar data dashboard selalu segar
        this.pollingStats = setInterval(() => {
            this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)));
        }, 10000); 
    }

    componentWillUnmount() {
        // Hentikan polling saat pindah halaman biar nggak berat
        if (this.pollingStats) clearInterval(this.pollingStats);
    }

    /**
     * Fungsi Helper untuk merender Card
     * Menambahkan pengecekan isNaN agar tidak muncul NaN% di UI
     */
    renderCard(title, count, percentage, smallText, icon, colorClass, barColor) {
        // LOGIKA PERBAIKAN: Jika percentage bukan angka (NaN), null, atau undefined, set ke 0
        const safePercentage = isNaN(percentage) || percentage === null || percentage === undefined 
            ? 0 
            : Math.round(percentage); // Gunakan Math.round agar angka lebih cantik tanpa desimal panjang

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                            {count || 0}
                        </h3>
                    </div>
                    <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg`}>
                        <i className={`fa ${icon} text-xl`}></i>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1">
                            <span className="font-bold text-gray-700">{safePercentage}%</span>
                            <span className="text-gray-400 font-medium">Progres</span>
                        </div>
                        <span className="text-gray-400 italic">{smallText}</span>
                    </div>
                    
                    {/* Progress Bar Area */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out`} 
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-1">
                {/* Card 1: Status Pengisian */}
                {this.renderCard(
                    "Selesai Mengisi",
                    flagCount.total_selesai,
                    flagCount.percentSelesai,
                    `Sisa: ${flagCount.total_belum || 0}`,
                    "fa-check-circle", 
                    "bg-[#006d32]", // Hijau UNJ
                    "bg-[#006d32]"
                )}

                {/* Card 2: UKT Tinggi */}
                {this.renderCard(
                    "UKT Tinggi",
                    flagCount.ukt_tinggi,
                    flagCount.percentUktTinggi,
                    `Seleksi: ${flagCount.ukt_seleksi || 0}`,
                    "fa-line-chart", 
                    "bg-[#ffcc00]", // Kuning UNJ
                    "bg-[#ffcc00]"
                )}

                {/* Card 3: Terima UKT */}
                {this.renderCard(
                    "Terima UKT",
                    flagCount.terima_ukt,
                    flagCount.percentTerima,
                    `Antre: ${flagCount.pengumuman || 0}`,
                    "fa-handshake-o", 
                    "bg-blue-600",
                    "bg-blue-500"
                )}

                {/* Card 4: Sanggah UKT */}
                {this.renderCard(
                    "Selesai Sanggah",
                    flagCount.selesai_sanggah,
                    flagCount.percentSanggah,
                    `Total: ${flagCount.sanggah_ukt || 0}`,
                    "fa-gavel", 
                    "bg-rose-600",
                    "bg-rose-500"
                )}
            </div>
        );
    }
}

// Map State dari Redux
const mapStateToProps = (store) => ({
    flagCount: store.cmahasiswa.flagCount
});

export default connect(mapStateToProps)(SummaryCmahasiswa);