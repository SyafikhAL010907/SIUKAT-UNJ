import React from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux'
import { cmahasiswa, ukt, user, hitung } from '../../../actions'
import { Ayah, Ibu, Kendaraan, Listrik, Pendukung, Pribadi, Rumah, Wali } from './details'
import { cookies, cookieName, rupiah } from '../../../global'

class DetailCmahasiswa extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: '1' };
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
    this.props.dispatch(cmahasiswa.getById(cookies.get(cookieName), this.props.match.params.no_peserta))
    this.props.dispatch(ukt.getById(cookies.get(cookieName), this.props.match.params.no_peserta))
    this.props.dispatch(hitung.flagHitung(cookies.get(cookieName), this.props.match.params.no_peserta))
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  batalKlarifikasi = () => {
    const token = cookies.get(cookieName);
    const noPeserta = this.props.match.params.no_peserta;
    this.props.dispatch(cmahasiswa.flagBatalKlarifikasi(token, noPeserta))
      .then(() => {
        this.props.dispatch(cmahasiswa.getById(token, noPeserta));
      });
  }

  selesaiKlarifikasi = () => {
    const token = cookies.get(cookieName);
    const noPeserta = this.props.match.params.no_peserta;
    this.props.dispatch(cmahasiswa.flagSelesaiKlarifikasi(token, noPeserta))
      .then(() => {
        this.props.dispatch(cmahasiswa.getById(token, noPeserta));
      });
  }

  selesaiHitung = (e, atribut) => {
    e.preventDefault();
    const { dispatch, match } = this.props;
    const token = cookies.get(cookieName);
    const noPeserta = match.params.no_peserta;

    // Hitung ulang → setelah selesai, langsung re-fetch data mahasiswa
    // supaya "UKT Saat Ini" di header langsung update tanpa perlu refresh halaman
    dispatch(hitung.flagHitung(token, noPeserta, atribut))
      .then(() => {
        dispatch(cmahasiswa.getById(token, noPeserta))
      })
  }

  render() {
    const { activeTab } = this.state;
    // Safety Check: Jika data cmahasiswa belom ada, jangan paksa render atribut
    // Prioritaskan state dari router (dari klik tombol Sanggah), fallback ke atribut DB
    const isSanggah = this.props.location.state?.isSanggah || this.props.location.state?.modeEdit || (this.props.cmahasiswa && this.props.cmahasiswa.atribut === "sanggah");
    const fetchAtribut = isSanggah ? "sanggah" : "original";
    
    // Protokol RBAC: Validator murni Read-Only. Developer & Operator bisa edit (Hanya dalam mode Sanggah).
    const userRole = this.props.user?.role;
    const canEdit = isSanggah && (userRole === 'admin' || userRole === 'operator' || userRole === 'developer') && userRole !== 'validator';

    return (
      <div className="space-y-6">
        {/* Header Section: UKT Info & Actions */}
        {(this.props.cmahasiswa && this.props.cmahasiswa.golongan_id) && (
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-700 p-3 rounded-xl shadow-lg shadow-emerald-200">
                <i className="fa fa-money text-yellow-400 text-xl"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">UKT Saat Ini</p>
                <h4 className="text-xl font-extrabold text-gray-800">
                  {rupiah(this.props.ukt[this.props.cmahasiswa.golongan_id])} 
                  <span className="ml-2 text-emerald-600">({this.props.cmahasiswa.golongan_id})</span>
                  {this.props.cmahasiswa.penalty === '1' && <span className="ml-2 text-red-500 text-sm font-medium border-l pl-2 border-gray-200 italic">- Penalty</span>}
                </h4>
              </div>
            </div>

            {isSanggah && userRole !== 'validator' && this.props.cmahasiswa.flag === 'sanggah_ukt' && (
              <div className="flex space-x-3">
                <button 
                  onClick={this.selesaiKlarifikasi}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  <i className="fa fa-check mr-2"></i>Selesai Klarifikasi
                </button>
                <button 
                  onClick={this.batalKlarifikasi}
                  className="px-5 py-2 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  <i className="fa fa-times mr-2"></i>Batal
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gray-100/50 p-1 rounded-2xl flex flex-wrap gap-1">
          {[
            { id: '1', label: 'Pribadi', icon: 'fa-user' },
            { id: '2', label: 'Orang Tua/Wali', icon: 'fa-users' },
            { id: '3', label: 'Rumah & Listrik', icon: 'fa-home' },
            { id: '4', label: 'Kendaraan', icon: 'fa-motorcycle' },
            { id: '5', label: 'Pendukung', icon: 'fa-file-text' },
            { id: '6', label: 'Simulasi Hitung', icon: 'fa-calculator' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => this.toggle(tab.id)}
              className={classnames(
                "flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2",
                activeTab === tab.id 
                  ? "bg-white text-emerald-800 shadow-sm border-b-2 border-yellow-400" 
                  : "text-gray-500 hover:bg-gray-200/50 hover:text-emerald-700"
              )}
            >
              <i className={`fa ${tab.icon} ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400'}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[400px]">
          {activeTab === '1' && (
            <div className="animate-fadeIn">
              <Pribadi noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
            </div>
          )}

          {activeTab === '2' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
              <Ayah noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
              <Ibu noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
              <div className="lg:col-span-2 pt-6 border-t border-dashed">
                <Wali noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
              </div>
            </div>
          )}

          {activeTab === '3' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
              <Rumah noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
              <Listrik noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
            </div>
          )}

          {activeTab === '4' && (
            <div className="animate-fadeIn">
              <Kendaraan noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
            </div>
          )}

          {activeTab === '5' && (
            <div className="animate-fadeIn">
              <Pendukung noPeserta={this.props.match.params.no_peserta} editable={canEdit} atribut={fetchAtribut} />
            </div>
          )}

          {activeTab === '6' && (
            <div className="animate-fadeIn max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-yellow-50 rounded-full mb-4">
                  <i className="fa fa-calculator text-3xl text-yellow-600"></i>
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Simulasi Perhitungan UKT</h3>
                <p className="text-sm text-gray-500 mt-2">Hitung ulang potensi UKT berdasarkan data terbaru mahasiswa.</p>
              </div>
              
              <button 
                type="button"
                onClick={(e) => this.selesaiHitung(e, fetchAtribut)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all mb-8 flex items-center justify-center space-x-2"
              >
                <i className="fa fa-refresh"></i>
                <span>Coba Menghitung Ulang</span>
              </button>

              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <table className="w-full text-left text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 font-bold text-gray-600 bg-white w-1/2">UKT yang harusnya didapat</th>
                      <td className="px-6 py-4 font-extrabold text-emerald-700 italic">
                        { (this.props.hitung && this.props.hitung.choosenUkt) ? (
                            `${this.props.hitung.choosenUkt} — ${rupiah(this.props.ukt[this.props.hitung.choosenUkt] || 0)}`
                        ) : "Menghitung..." }
                      </td>
                    </tr>
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600 bg-white">Indeks Kemampuan Bayar (IKB)</th>
                      <td className="px-6 py-4 font-mono font-bold text-gray-800">
                        {(this.props.hitung.ikb !== undefined) ? rupiah(parseInt(this.props.hitung.ikb, 10)) : "Rp. 0"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  (store) => ({
      ukt: store.ukt.ukt,
      cmahasiswa: store.cmahasiswa.singleCmahasiswa,
      user: store.user.user,
      hitung: store.hitung.hitung
  })
)(DetailCmahasiswa)