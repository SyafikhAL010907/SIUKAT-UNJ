export default {
  items: [
    {
      name: 'Halaman Utama',
      url: '/admin/dashboard',
      icon: 'fa fa-dashboard',
      badge: {
        variant: 'success',
        text: ''
      }
    },
    // {
    //   title: true,
    //   name: 'Navigasi Utama',
    //   wrapper: {            // optional wrapper object
    //     element: "span",      // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ""             // optional class names space delimited list for title item ex: "text-center"
    // },
    {
      name: 'Manajemen',
      url: '/admin/manajemen',
      icon: 'fa fa-bars',
      children: [
        {
          name: 'Administrator',
          url: '/admin/manajemen/administrator',
          icon: 'fa fa-user'
        },
        {
          name: 'Jadwal UKT',
          url: '/admin/manajemen/jadwal-ukt',
          icon: 'fa fa-clock-o'
        },
      ]
    },
    {
      name: 'Calon Mahasiswa',
      url: '/admin/peserta',
      icon: 'fa fa-user',
      children: [
        {
          name: 'Data Master',
          url: '/admin/peserta/semua',
          icon: 'fa fa-circle-o',
        },
        {
          name: 'Data Klarifikasi',
          url: '/admin/peserta/klarifikasi',
          icon: 'fa fa-circle-o',
        }
        // {
        //   name: 'Sanggah',
        //   url: '/admin/peserta/sanggah',
        //   icon: 'fa fa-circle-o'
        // },
        // {
        //   name: 'Bidik Misi',
        //   url: '/admin/peserta/bidik-misi',
        //   icon: 'fa fa-circle-o'
        // }
      ]
    },
    {
      name: 'Rekapitulasi',
      url: '/admin/rekapitulasi',
      icon: 'fa fa-book',
      children: [
        {
          name: 'Program Studi',
          url: '/admin/rekapitulasi/program-studi',
          icon: 'fa fa-circle-o',
        },
        {
          name: 'Fakultas',
          url: '/admin/rekapitulasi/fakultas',
          icon: 'fa fa-circle-o'
        }
      ]
    },
  ]
};
