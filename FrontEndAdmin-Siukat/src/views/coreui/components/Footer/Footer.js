import React, { Component } from "react";
import logoUnj from "../../../../views/dist/images/unj.png";

class Footer extends Component {
  render() {
    return (
      <footer className="w-full bg-white border-t-2 border-[#ffcc00] py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Bagian Kiri: Logo & Nama Instansi */}
          <div className="flex items-center space-x-3 group">
            {/* Menggunakan path gambar sesuai instruksi awal Anda */}
            <img
              src={logoUnj}
              alt="Logo UNJ"
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />

            <div className="flex flex-col border-l border-gray-200 pl-3">
              <span className="text-xs font-bold leading-none tracking-tight text-[#006d32]">
                ADMISI
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                Universitas Negeri Jakarta
              </span>
            </div>
          </div>

          {/* Bagian Kanan: Copyright */}
          <div className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-wide bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-[#006d32]">All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
