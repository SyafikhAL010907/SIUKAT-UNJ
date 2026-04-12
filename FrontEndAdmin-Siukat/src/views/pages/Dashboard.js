import React from 'react'
import { SummaryCmahasiswa, DashboardChartMetadata } from '../components';
import { dashboard } from "../../actions"
import { connect } from 'react-redux'
import { cookies, cookieName } from "../../global"
// Import sudah benar
import ButtonInject from '../../views/components/ButtonInject';

class Dashboards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [],
            startDates: [],
            endDates: []
        }
    }

    componentDidMount() {
        // Initial fetch
        this.props.dispatch(dashboard.fetchData(cookies.get(cookieName)));

        // Real-time Update: Polling data grafik/chart setiap 30 detik
        this.pollingDashboard = setInterval(() => {
            this.props.dispatch(dashboard.fetchData(cookies.get(cookieName)));
        }, 30000);
    }

    componentWillUnmount() {
        // Hentikan polling agar tidak membebani server/browser
        if (this.pollingDashboard) clearInterval(this.pollingDashboard);
    }

    render() {
        return (
            /* Background utama dipastikan Putih */
            <div className="min-h-screen bg-white p-4 md:p-8">
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
                                    Traffic Pengisian UKT
                                </h2>
                                <p className="text-sm text-gray-400 mt-1 font-medium">
                                    Monitoring aktivitas mahasiswa per fakultas secara real-time
                                </p>
                            </div>
                            
                            {/* Area Aksi: Ditambahkan ButtonInject di sini */}
                            <div className="flex items-center space-x-4">
                                {/* Tombol Inject Data */}
                                <ButtonInject />

                                <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sistem Aktif</span>
                                    </div>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="p-2 text-gray-400 hover:text-[#006d32] transition-colors focus:outline-none"
                                        title="Refresh Halaman"
                                    >
                                        <i className="fa fa-refresh text-lg"></i>
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
                                <strong>Catatan Admin:</strong> Data statistik ini diperbarui secara otomatis. Anda dapat menggunakan tombol <strong>Inject</strong> untuk mengunggah data mahasiswa baru dari file Excel ke sistem.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}

export default connect((store) => ({
    fields: store.dashboarddata.fields,
    startDates: store.dashboarddata.startDates,
    endDates: store.dashboarddata.endDates
}))(Dashboards)