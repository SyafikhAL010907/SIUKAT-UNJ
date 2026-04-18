export default function reducer(
  state = {
    datatable: {
      count: null,
      totalPages: null,
      currentPage: 1,
      perPage: 10,
      keyword: "",
    },
    cmahasiswa: [],
    singleCmahasiswa: {},
    flagCount: {
      belum_isi: 0,
      pengisian: 0,
      pengumuman: 0,
      terima_ukt: 0,
      sanggah_ukt: 0,
      selesai_sanggah: 0,

      ukt_tinggi: 0,
      ukt_seleksi: 0,

      total: 0,
      total_belum: 0,
      total_selesai: 0,

      percentSelesai: 0,
      percentTerima: 0,
      percentSanggah: 0,
      percentUktTinggi: 0,
    },
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_CMAHASISWA": {
      return { ...state, fetching: true };
    }
    case "FETCH_CMAHASISWA_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_CMAHASISWA_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        cmahasiswa: action.payload.rows,
        datatable: {
          count: action.payload.count,
          totalPages: Math.ceil(action.payload.count / action.payload.perPage),
          currentPage: action.payload.currentPage,
          perPage: action.payload.perPage,
          keyword: action.payload.keyword,
        },
      };
    }
    case "FETCH_SINGLE_CMAHASISWA": {
      return { ...state, fetching: true };
    }
    case "FETCH_SINGLE_CMAHASISWA_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_SINGLE_CMAHASISWA_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        singleCmahasiswa: {
          ...action.payload,
        },
      };
    }
    case "FETCH_FLAG_COUNT": {
      return { ...state, fetching: true };
    }
    case "FETCH_FLAG_COUNT_REJECTED": {
      return { ...state, fetching: false, error: action.payload };
    }
    case "FETCH_FLAG_COUNT_FULFILLED": {
      let belum_isi = action.payload.belum_isi[0].belum_isi,
        pengisian = action.payload.pengisian[0].pengisian,
        selesai_isi = action.payload.selesai_isi[0].selesai_isi,
        pengumuman = action.payload.pengumuman[0].pengumuman,
        terima_ukt = action.payload.terima_ukt[0].terima_ukt,
        sanggah_ukt = action.payload.sanggah_ukt[0].sanggah_ukt,
        selesai_sanggah = action.payload.selesai_sanggah[0].selesai_sanggah,
        ukt_tinggi = action.payload.ukt_tinggi[0].ukt_tinggi,
        ukt_seleksi = action.payload.ukt_tinggi_tidak[0].ukt_tinggi_tidak;

      let total = belum_isi + selesai_isi,
        total_belum = belum_isi,
        total_selesai = selesai_isi;

      return {
        ...state,
        fetching: false,
        fetched: true,
        flagCount: {
          belum_isi: belum_isi,
          pengisian: pengisian,
          selesai_isi: selesai_isi,
          pengumuman: pengumuman,
          terima_ukt: terima_ukt,
          sanggah_ukt: sanggah_ukt,
          selesai_sanggah: selesai_sanggah,

          ukt_tinggi: ukt_tinggi,
          ukt_seleksi: ukt_seleksi,

          total: total,
          total_belum: total_belum,
          total_selesai: total_selesai,

          percentSelesai: (total_selesai / total) * 100,
          percentTerima: (terima_ukt / total) * 100,
          percentSanggah:
            (selesai_sanggah / (selesai_sanggah + sanggah_ukt)) * 100,
          percentUktTinggi: (ukt_tinggi / total) * 100,
        },
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
