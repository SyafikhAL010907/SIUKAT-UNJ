import React from 'react';

class KetentuanKlarifikasi extends React.Component{
    render() {
        const items = [
            "Klarifikasi data UKT hanya dapat dilakukan bila dokumen yang diunggah keliru.",
            "Proses klarifikasi data UKT dilakukan oleh calon mahasiswa baru bersama orang tua atau wali.",
            "Wajib membawa berkas-berkas yang sebelumnya dianggap keliru (misal: slip gaji, tagihan listrik).",
            "Proses klarifikasi hanya dapat dilakukan pada waktu dan tempat yang telah ditentukan."
        ];
        return (
            <div className="mt-2">
                {items.map((text, idx) => (
                    <div key={idx} className="d-flex align-items-start mb-3 bg-light p-2 p-sm-3 rounded-xl border-left shadow-sm" style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}>
                        <div className="mr-2 mr-sm-3 mt-1">
                            <i className="fa fa-check-circle-o text-success" style={{ fontSize: '1.1rem' }}></i>
                        </div>
                        <div className="font-weight-600 color-emerald text-[11px] sm:text-sm md:text-base">
                            {text}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default KetentuanKlarifikasi;