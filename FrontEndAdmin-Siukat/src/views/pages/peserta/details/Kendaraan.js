import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { kendaraan as kendaraanAction } from '../../../../actions';
import { InputBs, InputFileBs, money } from '../../../components';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

// --- KOMPONEN MODAL FORM (FormKendaraan) ---
let FormKendaraan = (props) => {
    const { 
        handleSubmit, toggleKendaraan, handleToggleKendaraan,
        pristine, submitting, initialValues,
        status_motor, status_mobil, pajak_motor, pajak_mobil 
    } = props;

    if (!toggleKendaraan) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleToggleKendaraan}></div>
            
            <div className="relative w-full max-w-3xl mx-auto z-50">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-0">
                    
                    {/* Header */}
                    <div className="bg-green-700 px-6 py-4 flex justify-between items-center text-white">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-motorcycle"></i> Form Data Kendaraan
                        </h3>
                        <button onClick={handleToggleKendaraan} className="hover:rotate-90 transition-transform duration-300">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} id="form-kendaraan" className="p-6 max-h-[70vh] overflow-y-auto space-y-8">
                        
                        {/* SECTION MOTOR */}
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <legend className="text-md font-bold text-green-700 mb-4 flex items-center gap-2">
                                <i className="fa fa-motorcycle"></i> Data Motor
                            </legend>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <label className="md:col-span-3 font-semibold text-gray-700 text-sm">Status Motor</label>
                                <div className="md:col-span-9 flex gap-6">
                                    {['ada', 'tidak'].map((opt) => (
                                        <label key={opt} className="flex items-center cursor-pointer group">
                                            <Field name="status_motor" component="input" type="radio" value={opt} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300" />
                                            <span className="ml-2 capitalize group-hover:text-green-700 transition">{opt === 'ada' ? 'Ada' : 'Tidak Ada'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {status_motor === "ada" && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <label className="md:col-span-3 text-sm font-medium">Jumlah Motor</label>
                                        <div className="md:col-span-9">
                                            <Field name="jumlah_motor" component={InputBs} type="number" className="w-full rounded-md border-gray-300" />
                                            <p className="text-[10px] text-gray-400 mt-1 italic">*Jumlah motor dalam satu KK</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <label className="md:col-span-3 text-sm font-medium">Pajak Motor</label>
                                        <div className="md:col-span-5">
                                            <Field name="pajak_motor" component={InputBs} type="number" validate={[money]} />
                                        </div>
                                        <div className="md:col-span-4 bg-green-100 text-green-700 py-2 px-3 rounded font-bold text-center text-sm">
                                            {rupiah(pajak_motor)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <label className="md:col-span-3 text-sm font-medium">STNK Motor (PDF)</label>
                                        <div className="md:col-span-9 flex flex-col sm:flex-row gap-2">
                                            <div className="flex-grow">
                                                <Field name="file_scan_motor" component={InputFileBs} />
                                            </div>
                                            {initialValues.scan_motor && (
                                                <a href={`${storage}/${initialValues.scan_motor}`} target="_blank" rel="noopener noreferrer" 
                                                   className="bg-blue-500 text-white px-3 py-2 rounded text-xs flex items-center justify-center gap-1 hover:bg-blue-600">
                                                    <i className="fa fa-eye"></i> Lihat
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION MOBIL */}
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <legend className="text-md font-bold text-blue-700 mb-4 flex items-center gap-2">
                                <i className="fa fa-car"></i> Data Mobil
                            </legend>
                            {/* ... (Struktur yang sama dengan Motor, gunakan status_mobil & pajak_mobil) ... */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <label className="md:col-span-3 font-semibold text-gray-700 text-sm">Status Mobil</label>
                                <div className="md:col-span-9 flex gap-6">
                                    {['ada', 'tidak'].map((opt) => (
                                        <label key={opt} className="flex items-center cursor-pointer group">
                                            <Field name="status_mobil" component="input" type="radio" value={opt} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                            <span className="ml-2 capitalize group-hover:text-blue-700 transition">{opt === 'ada' ? 'Ada' : 'Tidak Ada'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {status_mobil === "ada" && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <label className="md:col-span-3 text-sm font-medium">Pajak Mobil</label>
                                        <div className="md:col-span-5">
                                            <Field name="pajak_mobil" component={InputBs} type="number" validate={[money]} />
                                        </div>
                                        <div className="md:col-span-4 bg-blue-100 text-blue-700 py-2 px-3 rounded font-bold text-center text-sm">
                                            {rupiah(pajak_mobil)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <label className="md:col-span-3 text-sm font-medium">STNK Mobil (PDF)</label>
                                        <div className="md:col-span-9 flex flex-col sm:flex-row gap-2">
                                            <div className="flex-grow">
                                                <Field name="file_scan_mobil" component={InputFileBs} />
                                            </div>
                                            {initialValues.scan_mobil && (
                                                <a href={`${storage}/${initialValues.scan_mobil}`} target="_blank" rel="noopener noreferrer" 
                                                   className="bg-blue-500 text-white px-3 py-2 rounded text-xs flex items-center justify-center gap-1 hover:bg-blue-600">
                                                    <i className="fa fa-eye"></i> Lihat
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-4 bg-gray-100 flex justify-end gap-3">
                        <button onClick={handleToggleKendaraan} className="px-6 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 font-bold transition">Batal</button>
                        <button type="submit" form="form-kendaraan" disabled={pristine || submitting} 
                                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg disabled:opacity-50 transition">
                            <i className="fa fa-save mr-2"></i> Simpan Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN TAMPILAN UTAMA (Kendaraan) ---
class Kendaraan extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalToggle: false };
    }

    componentWillMount() {
        this.props.dispatch(kendaraanAction.getById(cookies.get(cookieName), this.props.noPeserta, this.props.atribut));
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle });
    }

    submitKendaraan = (values) => {
        this.modalToggle();
        const formData = new FormData();
        for (let key in values) {
            if (key.startsWith("file_scan") && values[key]) {
                formData.append(key, values[key][0]);
                const el = document.getElementById(key);
                if (el) el.value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(kendaraanAction.updateData(cookies.get(cookieName), formData, this.props.noPeserta));
        this.props.dispatch(reset('DataKendaraanSeleksi'));
    }

    renderTable(type, data) {
        const isMotor = type === 'motor';
        const status = isMotor ? data.status_motor : data.status_mobil;
        const jumlah = isMotor ? data.jumlah_motor : data.jumlah_mobil;
        const pajak = isMotor ? data.pajak_motor : data.pajak_mobil;
        const scan = isMotor ? data.scan_motor : data.scan_mobil;

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                <div className={`p-4 border-b ${isMotor ? 'bg-green-50' : 'bg-blue-50'} flex items-center gap-2 font-bold`}>
                    <i className={`fa ${isMotor ? 'fa-motorcycle text-green-700' : 'fa-car text-blue-700'}`}></i>
                    <span className="uppercase text-gray-700 tracking-wider text-sm">{isMotor ? 'Data Motor' : 'Data Mobil'}</span>
                </div>
                <div className="p-0">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${status === 'ada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {status || 'Belum diisi'}
                                    </span>
                                </td>
                            </tr>
                            {status === "ada" && (
                                <>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Jumlah</td>
                                        <td className="p-4 font-medium">{jumlah} <span className="text-gray-400 font-normal">(dalam 1 KK)</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Pajak / Thn</td>
                                        <td className="p-4 font-bold text-green-700">{rupiah(pajak)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">STNK</td>
                                        <td className="p-4">
                                            {scan ? (
                                                <a href={`${storage}/${scan}`} target="_blank" rel="noopener noreferrer" 
                                                   className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold">
                                                    <i className="fa fa-download"></i> Download STNK
                                                </a>
                                            ) : <span className="text-gray-400 italic">Belum diunggah</span>}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    render() {
        const { kendaraan: data, editable } = this.props;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-2xl font-black text-gray-800 tracking-tight">Inventaris Kendaraan</h4>
                        <p className="text-gray-500 text-sm">Data motor dan mobil keluarga yang tercatat di KK.</p>
                    </div>
                    {editable && (
                        <button onClick={this.modalToggle} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-bold shadow-md transition transform hover:scale-105 flex items-center gap-2">
                            <i className="fa fa-pencil"></i> Perbarui Data
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {this.renderTable('motor', data)}
                    {this.renderTable('mobil', data)}
                </div>

                <FormKendaraan
                    onSubmit={this.submitKendaraan}
                    initialValues={data}
                    toggleKendaraan={this.state.modalToggle}
                    handleToggleKendaraan={this.modalToggle}
                />
            </div>
        );
    }
}

// --- REDUX FORM WRAPPER ---
FormKendaraan = reduxForm({
    form: 'DataKendaraanSeleksi',
    enableReinitialize: true,
})(FormKendaraan);

const selector = formValueSelector('DataKendaraanSeleksi');

FormKendaraan = connect((store) => {
    const { status_motor, status_mobil, pajak_motor, pajak_mobil } = selector(store, 'status_motor', 'status_mobil', 'pajak_motor', 'pajak_mobil');
    return { status_motor, status_mobil, pajak_motor, pajak_mobil };
})(FormKendaraan);

export default connect(
    (store) => ({ kendaraan: store.kendaraan.kendaraan })
)(Kendaraan);