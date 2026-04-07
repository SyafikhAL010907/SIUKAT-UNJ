import React from 'react'
import { cmahasiswa } from '../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../global'

class SummaryCmahasiswa extends React.Component {
    componentWillMount() {
        this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)))
    }

    renderCard(title, count, percentage, smallText, icon, colorClass, barColor) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${colorClass} text-white shadow-sm`}>
                        <i className={`fa ${icon} text-xl`}></i>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-emerald-700">{percentage}%</span>
                        <span className="text-gray-400">{smallText}</span>
                    </div>
                    {/* Progress Bar Area */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                            className={`${barColor} h-1.5 rounded-full transition-all duration-1000`} 
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { flagCount } = this.props;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Status Pengisian */}
                {this.renderCard(
                    "Selesai Mengisi",
                    flagCount.total_selesai,
                    flagCount.percentSelesai,
                    `Belum: ${flagCount.total_belum}`,
                    "fa-check-circle", 
                    "bg-emerald-600", // Hijau UNJ
                    "bg-emerald-500"
                )}

                {/* Card 2: UKT Tinggi */}
                {this.renderCard(
                    "UKT Tinggi",
                    flagCount.ukt_tinggi,
                    flagCount.percentUktTinggi,
                    `Seleksi: ${flagCount.ukt_seleksi}`,
                    "fa-line-chart", 
                    "bg-amber-500", // Kuning/Gold UNJ
                    "bg-amber-400"
                )}

                {/* Card 3: Terima UKT */}
                {this.renderCard(
                    "Terima UKT",
                    flagCount.terima_ukt,
                    flagCount.percentTerima,
                    `Belum Pilih: ${flagCount.pengumuman}`,
                    "fa-handshake-o", 
                    "bg-blue-600",
                    "bg-blue-500"
                )}

                {/* Card 4: Sanggah UKT */}
                {this.renderCard(
                    "Selesai Sanggah",
                    flagCount.selesai_sanggah,
                    flagCount.percentSanggah,
                    `Total Sanggah: ${flagCount.sanggah_ukt}`,
                    "fa-gavel", 
                    "bg-rose-600",
                    "bg-rose-500"
                )}
            </div>
        )
    }
}

export default connect((store) => ({
    flagCount: store.cmahasiswa.flagCount
}))(SummaryCmahasiswa)