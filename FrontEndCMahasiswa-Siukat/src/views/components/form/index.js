import React  from 'react';
import { Input, FormFeedback } from 'reactstrap';
import swal from 'sweetalert';
import { SyaratFoto, SyaratScan } from './SyaratFile';
import { AlertFormLengkap, AlertFormBelumLengkap } from './AlertFormLengkap';
import InputDayPicker from './InputDayPicker';

const required = value => value ? undefined : 'Kolom wajib diisi';
const money = value => /^[0-9]+$/.test(value) ? undefined : 'Selain angka (0-9) tidak diperbolehkan';

const InputBs = (props) => {
    const { input, meta: { error, warning} , ...rest } = props;
    return (
        <span>
            <Input {...input} {...rest} valid={((error || warning) && (false))}/>
            {((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
        </span>
    );
};

const InputFileBs = (props) => {
    const { input, meta: { error, warning }, ...rest } = props;
    delete input.value;

    const handleFileValidation = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fieldName = (input.name || "").toLowerCase();
        const ext = file.name.split('.').pop().toLowerCase();

        // 1. Check Format Standar (Security & Logic)
        // Broaden detection: foto, profile, gambar, scan_ktp, etc.
        const isPhotoField = fieldName.includes('foto') || 
                             fieldName.includes('profile') || 
                             fieldName.includes('gambar') || 
                             fieldName.includes('foto_cmahasiswa');
        
        const allowedImageExts = ['jpg', 'jpeg', 'png'];
        
        if (isPhotoField) {
            if (!allowedImageExts.includes(ext)) {
                swal({
                    title: "Format tidak memenuhi standar!",
                    text: "Untuk foto profil, harap gunakan format JPG, JPEG, atau PNG.",
                    icon: "warning",
                });
                e.target.value = ''; 
                return;
            }
        } else {
            // Document fields: Only PDF
            if (ext !== 'pdf') {
                swal({
                    title: "Format tidak memenuhi standar!",
                    text: "Untuk dokumen pendukung, harap gunakan format PDF.",
                    icon: "warning",
                });
                e.target.value = '';
                return;
            }
        }

        // 2. Strict Check Double Extension (Security Risk)
        if (file.name.split('.').length > 2) {
            swal({
                title: "File Tidak Aman!",
                text: "Dilarang menggunakan double extension (Contoh: file.jpg.php). Harap ganti nama file Anda dan pastikan hanya ada satu titik.",
                icon: "error",
                dangerMode: true,
            });
            e.target.value = ''; 
            return;
        }

        // 3. Check Size (Maks 200KB)
        const maxSize = 200 * 1024; 
        if (file.size > maxSize) {
            swal({
                title: "File Terlalu Besar!",
                text: `Ukuran file Anda (${(file.size / 1024).toFixed(1)} KB) melebihi batas maksimal 200 KB. Harap kompres file Anda.`,
                icon: "warning",
            });
            e.target.value = ''; 
            return;
        }

        // Jalankan original onChange jika ada
        if (input.onChange) {
            input.onChange(e);
        }
    };

    return (
        <span>
            <Input 
                className="form-control" 
                {...input} 
                {...rest} 
                onChange={handleFileValidation}
                valid={((error || warning) && (false))}
            />
        </span>
    );
};

export {
    InputBs,
    InputFileBs,
    InputDayPicker,
    required,
    money,

    SyaratFoto,
    SyaratScan,
    AlertFormLengkap,
    AlertFormBelumLengkap,
};