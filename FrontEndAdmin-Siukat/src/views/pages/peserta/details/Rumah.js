import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { rumah } from '../../../../actions';
import { InputBs, InputFileBs, money } from '../../../components';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

/**
 * KOMPONEN: FormRumah (Modal Form)
 * Menggunakan Tailwind untuk Modal dan Layouting
 */
let FormRumah = (props) => {
    const { 
        handleSubmit, handleToggleRumah, toggleRumah, 
        pristine, submitting, initialValues,
        status_kepemilikan, biaya_kontrak, biaya_pbb 
    } = props;

    if (!toggleRumah) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleToggleRumah}></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-3xl mx-auto my-6 z-50">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-solid border-gray-200 rounded-t bg-emerald-600 text-white">
                        <h3 className="text-xl font-bold">Perbarui Data Rumah</h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:rotate-90 transition-transform"
                            onClick={handleToggleRumah}
                        >
                            <span>&times;</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-6 flex-auto overflow-y-auto">
                        <form onSubmit={handleSubmit} id="form-rumah" className="space-y-6 text-sm text-gray-700">
                            
                            {/* Status Rumah */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b pb-4">
                                <label className="font-bold md:pt-2 text-gray-600">Status Rumah</label>
                                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Milik Sendiri', value: 'milik_sendiri' },
                                        { label: 'Bersama Saudara', value: 'bersama_saudara' },
                                        { label: 'Kontrak', value: 'kontrak' },
                                        { label: 'Menumpang', value: 'menumpang' }
                                    ].map((opt) => (
                                        <label key={opt.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                            <Field name="status_kepemilikan" component="input" type="radio" value={opt.value} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                                            <span className="ml-2 text-xs font-medium">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Kondisional: Milik Sendiri */}
                            {status_kepemilikan === "milik_sendiri" && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                                    <label className="font-bold text-gray-600">Status Sertifikat</label>
                                    <div className="md:col-span-3 space-y-2">
                                        {['hak_milik', 'hak_guna_bangunan', 'tanpa_sertifikat', 'tanah_girik', 'lainnya'].map((v) => (
                                            <label key={v} className="flex items-center space-x-3 py-1">
                                                <Field name="status_sertifikat" component="input" type="radio" value={v} className="text-green-600 focus:ring-green-500" />
                                                <span className="capitalize">{v.replace(/_/g, ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Kondisional: Bersama Saudara */}
                            {status_kepemilikan === "bersama_saudara" && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center animate-fadeIn">
                                    <label className="font-bold text-gray-600">Jumlah KK</label>
                                    <div className="md:col-span-3">
                                        <Field name="jumlah_kepala_keluarga" component="input" type="text" placeholder="Jumlah Kepala Keluarga Dalam Satu Rumah" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                                    </div>
                                </div>
                            )}

                            {/* Kondisional: Milik Sendiri / Bersama Saudara (Luas & PBB) */}
                            {(status_kepemilikan === "milik_sendiri" || status_kepemilikan === "bersama_saudara") && (
                                <div className="space-y-4 border-t pt-4 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                        <label className="font-bold text-gray-600">Dimensi & PBB</label>
                                        <div className="md:col-span-3 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <label className="block mb-1 font-medium">Luas Tanah (m²)</label>
                                                    <Field name="luas_tanah" component="input" type="text" className="w-full p-2 border border-gray-300 rounded" />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 font-medium">Luas Bangunan (m²)</label>
                                                    <Field name="luas_bangunan" component="input" type="text" className="w-full p-2 border border-gray-300 rounded" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="flex-1">
                                                    <label className="block mb-1 font-medium">Biaya PBB Terakhir</label>
                                                    <Field name="biaya_pbb" component="input" type="number" validate={[money]} className="w-full p-2 border border-gray-300 rounded" />
                                                </div>
                                                <div className="md:w-1/3 flex items-end">
                                                    <div className="w-full p-2 bg-green-100 text-green-800 rounded border border-green-200 text-center font-bold">
                                                        {rupiah(biaya_pbb)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Unggah Tagihan PBB (PDF, Max 500KB)</label>
                                                <Field name="file_scan_pbb" component={InputFileBs} type="file" id="file_scan_pbb" />
                                                {initialValues?.scan_pbb && (
                                                    <a href={`${storage}/${initialValues.scan_pbb}`} target="_blank" rel="noreferrer" className="inline-block mt-2 text-blue-600 hover:underline text-xs">
                                                        <i className="fa fa-file mr-1"></i> Lihat Berkas Lama
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kondisional: Kontrak */}
                            {status_kepemilikan === "kontrak" && (
                                <div className="space-y-4 border-t pt-4 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                        <label className="font-bold text-gray-600">Info Kontrak</label>
                                        <div className="md:col-span-3 space-y-4">
                                            <div className="flex flex-col md:flex-row gap-2 text-xs">
                                                <div className="flex-1">
                                                    <label className="block mb-1 font-medium">Biaya Kontrak / Tahun</label>
                                                    <Field name="biaya_kontrak" component="input" type="number" validate={[money]} className="w-full p-2 border border-gray-300 rounded" />
                                                </div>
                                                <div className="md:w-1/3 flex items-end">
                                                    <div className="w-full p-2 bg-green-100 text-green-800 rounded border border-green-200 text-center font-bold">
                                                        {rupiah(biaya_kontrak)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="block mb-1 font-medium">Surat Perjanjian Kontrak (PDF)</label>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <div className="flex-1 italic">
                                                        <Field name="file_scan_kontrak" component={InputFileBs} type="file" id="file_scan_kontrak" />
                                                    </div>
                                                    <button type="button" className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 border border-gray-300 transition">
                                                        <i className="fa fa-download mr-1"></i> Unduh Contoh
                                                    </button>
                                                </div>
                                                {initialValues?.scan_kontrak && (
                                                    <a href={`${storage}/${initialValues.scan_kontrak}`} target="_blank" rel="noreferrer" className="inline-block text-blue-600 hover:underline text-xs">
                                                        <i className="fa fa-file mr-1"></i> Lihat Berkas Lama
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-4 border-t border-solid border-gray-200 rounded-b bg-gray-50">
                        <button
                            className="px-6 py-2 mr-3 text-sm font-bold text-gray-600 uppercase transition-all hover:text-gray-800 outline-none focus:outline-none"
                            type="button"
                            onClick={handleToggleRumah}
                        >
                            Batal
                        </button>
                        <button
                            className="px-10 py-3 text-sm font-bold text-white uppercase bg-emerald-600 rounded-xl shadow-lg hover:shadow-xl outline-none focus:outline-none transition-all duration-150 disabled:opacity-50"
                            type="submit"
                            form="form-rumah"
                            disabled={pristine || submitting}
                        >
                            <i className="fa fa-save mr-2"></i> Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Redux-Form Decoration for FormRumah
FormRumah = reduxForm({
    form: 'DataRumahSeleksi',
    enableReinitialize: true,
})(FormRumah);

const selector = formValueSelector('DataRumahSeleksi');

FormRumah = connect((store) => {
    let { status_kepemilikan, biaya_pbb, biaya_kontrak } = selector(store, 'status_kepemilikan', 'biaya_pbb', 'biaya_kontrak');
    return {
        status_kepemilikan,
        biaya_pbb,
        biaya_kontrak,
    };
})(FormRumah);

/**
 * KOMPONEN UTAMA: Rumah (Class Component)
 * Menampilkan data dalam bentuk tabel modern
 */
class Rumah extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalToggle: false
        };
    }

    componentWillMount() {
        this.props.dispatch(rumah.getById(cookies.get(cookieName), this.props.noPeserta, this.props.atribut));
    }

    componentDidMount() {
        // Otomatis buka modal jika navigasi datang dari button "Sanggah" di DataTable
        const { location } = this.props;
        if (location.state && location.state.modeEdit) {
            // setTimeout(() => {
            //     this.setState({ modalToggle: true });
            // }, 800);
        }
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle });
    }

    submitRumah = (values) => {
        this.modalToggle();
        const formData = new FormData();
        for (let key in values) {
            const isFile = key.startsWith("file_scan");
            if (isFile && values[key] && values[key][0]) {
                formData.append(key, values[key][0]);
                const el = document.getElementById(key);
                if (el) el.value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(rumah.updateData(cookies.get(cookieName), formData, this.props.noPeserta)).then(() => {
            this.modalToggle();
            // Refetch data agar tampilan InfoItem langsung terupdate
            this.props.dispatch(rumah.getById(cookies.get(cookieName), this.props.noPeserta, this.props.atribut));
        });
        this.props.dispatch(reset('DataRumahSeleksi'));
    }

    render() {
        const { rumah, location } = this.props;
        const isModeSanggah = location.state && location.state.modeEdit;

        return (
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Banner Mode Sanggah */}
                {isModeSanggah && (
                    <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data rumah sekarang.</span>
                    </div>
                )}

                {/* Header Bagian */}
                <div className="flex flex-row items-center justify-between p-5 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800 tracking-tight text-uppercase italic">Informasi Rumah</h4>
                    </div>
                    {this.props.editable && (
                        <button
                            onClick={this.modalToggle}
                            className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md"
                        >
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                {/* Content Table */}
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <tbody className="divide-y divide-gray-100">
                            {/* Baris Status */}
                            <tr className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 w-1/3 uppercase text-[11px] tracking-widest">Status Rumah</td>
                                <td className="px-6 py-4 text-gray-800 font-medium capitalize border-l border-gray-100">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                                        {rumah.status_kepemilikan?.replace('_', ' ')}
                                    </span>
                                </td>
                            </tr>

                            {/* Jumlah KK */}
                            {rumah.status_kepemilikan !== "menumpang" && (
                                <tr className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Jumlah Kepala Keluarga</td>
                                    <td className="px-6 py-4 text-gray-800 border-l border-gray-100">
                                        <b className="text-lg text-green-700">{rumah.jumlah_kepala_keluarga}</b> <span className="text-gray-500">Kepala Keluarga dalam 1 rumah</span>
                                    </td>
                                </tr>
                            )}

                            {/* Status Sertifikat */}
                            {rumah.status_kepemilikan === "milik_sendiri" && (
                                <tr className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Status Sertifikat</td>
                                    <td className="px-6 py-4 text-gray-800 capitalize border-l border-gray-100 font-medium">
                                        {rumah.status_sertifikat?.replace(/_/g, ' ')}
                                    </td>
                                </tr>
                            )}

                            {/* Dimensi & PBB */}
                            {(rumah.status_kepemilikan === "milik_sendiri" || rumah.status_kepemilikan === "bersama_saudara") && (
                                <>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Luas Tanah / Bangunan</td>
                                        <td className="px-6 py-4 text-gray-800 border-l border-gray-100">
                                            <span className="font-semibold">{rumah.luas_tanah}</span> m² / <span className="font-semibold">{rumah.luas_bangunan}</span> m²
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Biaya PBB / Tahun</td>
                                        <td className="px-6 py-4 text-green-700 font-bold border-l border-gray-100">
                                            {rupiah(rumah.biaya_pbb)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Bukti Tagihan PBB</td>
                                        <td className="px-6 py-4 border-l border-gray-100">
                                            {rumah.scan_pbb ? (
                                                <a href={`${storage}/${rumah.scan_pbb}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded shadow hover:bg-blue-700 transition">
                                                    <i className="fa fa-download mr-2"></i> LIHAT DOKUMEN PBB
                                                </a>
                                            ) : <span className="text-red-400 italic text-xs font-medium">Belum diunggah</span>}
                                        </td>
                                    </tr>
                                </>
                            )}

                            {/* Info Kontrak */}
                            {rumah.status_kepemilikan === "kontrak" && (
                                <>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Biaya Kontrak / Tahun</td>
                                        <td className="px-6 py-4 text-green-700 font-bold border-l border-gray-100 italic">
                                            {rupiah(rumah.biaya_kontrak)}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-600 bg-gray-50/50 uppercase text-[11px] tracking-widest">Surat Perjanjian</td>
                                        <td className="px-6 py-4 border-l border-gray-100">
                                            {rumah.scan_kontrak ? (
                                                <a href={`${storage}/${rumah.scan_kontrak}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded shadow hover:bg-blue-700 transition">
                                                    <i className="fa fa-file mr-2"></i> SURAT KONTRAK
                                                </a>
                                            ) : <span className="text-red-400 italic text-xs font-medium">Belum diunggah</span>}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Komponen Modal Form */}
                <FormRumah
                    onSubmit={this.submitRumah}
                    initialValues={this.props.rumah}
                    toggleRumah={this.state.modalToggle}
                    handleToggleRumah={this.modalToggle}
                />
            </div>
        );
    }
}

// Map Redux State to Props
export default withRouter(connect(
    (store) => ({
        rumah: store.rumah.rumah,
    })
)(Rumah));