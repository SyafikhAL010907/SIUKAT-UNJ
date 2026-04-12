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
                    <div key={idx} className="d-flex align-items-start mb-3 bg-light p-3 rounded-lg border-left" style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}>
                        <div className="mr-3 mt-1">
                            <i className="fa fa-check-circle-o text-success" style={{ fontSize: '1.2rem' }}></i>
                        </div>
                        <div className="font-weight-600 color-emerald" style={{ fontSize: '0.95rem' }}>
                            {text}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default KetentuanKlarifikasi;