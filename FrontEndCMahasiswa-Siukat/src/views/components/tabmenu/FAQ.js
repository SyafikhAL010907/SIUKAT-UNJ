import React from 'react';
import { Link } from 'react-router-dom';

class FAQ extends React.Component {
    render() {
        return (
            <ul>
                <li>
                    <b>Apa hal pertama yang harus saya lakukan?</b>
                    <br />
          Calon mahasiswa diharuskan untuk mengunggah berkas-berkas dan
          form-form yang diperlukan. Terdapat 2 kelompok berkas yang diperlukan,
          yaitu:
                    <ol>
                        <li>
              Berkas yang disiapkan oleh calon mahasiswa (slip gaji, slip
              tagihan listrik, dll);
                        </li>
                        <li>
              Surat/form yang diunduh, dicetak, dan diisi oleh calon mahasiswa
              yang kemudian diunggah kembali ke dalam sistem meliputi:
                            <ul>
                                <li>Surat pernyataan kebenaran data;</li>
                                <li>Surat pernyataan komitmen pembiayaan wali;</li>
                                <li>Surat perjanjian kontrak</li>
                            </ul>
              Berkas ini dapat dilihat pada <b>Tab Berkas Yang Diperlukan</b>
                        </li>
                    </ol>
                    <hr />
                </li>
                <li>
                    <b>Apa saja berkas yang saya perlukan?</b>
                    <br />
          Berkas-berkas yang perlu disiapkan oleh calon mahasiswa, yaitu:
                    <ol>
                        <li>Pas foto calon mahasiswa;</li>
                        <li>
              Scan KTP Ayah dan KTP Ibu (jika Ayah dan/atau Ibu masih hidup);
                        </li>
                        <li>
              Scan slip gaji Ayah dan slip gaji Ibu;
                            <br />
                            <span className="text-red">
                Apabila tidak memiliki slip gaji, scan SURAT KETERANGAN
                PENGHASILAN Ayah dan Ibu dari RT/RW
                            </span>
                        </li>
                        <li>Scan Kartu Keluarga (KK);</li>
                        <li>Scan tagihan PBB terbaru atau Surat Perjanjian Kontrak;</li>
                        <li>
              Scan tagihan Listrik 3 bulan terakhir;
                            <br />
              Informasi tentang tagihan Listrik, klik{' '}
                            <Link to="main/petunjuk" className="btn btn-primary btn-sm">
                Disini
                            </Link>
                        </li>
                        <li>
              Scan STNK Motor dan mobil (jika memiliki motor dan/atau mobil).
                        </li>
                    </ol>
                    <hr />
                </li>
                <li>
                    <b>Apa yang harus saya lakukan setelah mengisi semua form?</b>
                    <br />
          Setelah mengisi semua form, calon mahasiswa diharuskan mengunduh{' '}
                    <b>Surat pernyataan kebenaran data</b> yang akan muncul setelah
          seluruh form terisi dengan benar. Surat tersebut harus ditandatangani
          terlebih dahulu kemudian di-scan dan diunggah kembali ke sistem.
          Setelah itu, jangan lupa untuk menekan tombol <b>KIRIM</b> untuk
          menyelesaikan pengisian data UKT.
                    <hr />
                </li>
                <li>
                    <b>
            Apakah Uang Kuliah Tunggal (UKT) dan Sumbangan Pengembangan
            Universitas (SPU) yang sudah dibayarkan dapat dikembalikan?
                    </b>
                    <br />
          Tidak, Biaya Uang Kulih Tunggal (UKT) dan Sumbangan Pengembangan
          Universitas (SPU) yg sudah dibayarkan tidak dapat dikembalikan,
          berlaku untuk semua jenjang.
                </li>
            </ul>
        );
    }
}

export default FAQ;
