/**
 * RBAC (Role-Based Access Control) Utility
 * Sistem Pengaman UI berdasarkan Role User
 */

export const ROLES = {
  DEVELOPER: "developer",
  OPERATOR: "operator",
  VALIDATOR: "validator",
};

/**
 * Cek apakah user punya akses ke menu/fitur tertentu
 * @param {string} role - Role user saat ini
 * @param {string} action - Nama aksi (misal: 'manage_admin', 'inject_data', 'edit_data')
 */
export const isAllowed = (role, action) => {
  switch (action) {
    case "SEE_ADMIN_MENU":
      // Developer dapet semuanya. Operator & Validator dilarang liat Admin Menu.
      return role === ROLES.DEVELOPER;

    case "INJECT_DATA":
      // Developer dapet semuanya. Operator & Validator dilarang Inject Data.
      return role === ROLES.DEVELOPER;

    case "EDIT_DATA":
      // Validator murni Read-Only. Developer & Operator bisa edit.
      return role !== ROLES.VALIDATOR;

    case "GLOBAL_TRIGGER":
      // Tombol Trigger (Tahun, Jalur, Flag) di Dashboard hanya untuk Developer.
      // Operator & Validator dilarang.
      return role === ROLES.DEVELOPER;

    case "SEE_UKT_MENU":
      // Sesuai request: Cuma Developer yang boleh liat menu UKT.
      return role === ROLES.DEVELOPER;

    default:
      return true;
  }
};

/**
 * Filter daftar menu sidebar berdasarkan permission
 */
export const filterNavigation = (items, role) => {
  if (!role) return items; // Safety check

  return (
    items
      .filter((item) => {
        // Cek spesifik buat menu Administrator
        if (item.url === "/admin/manajemen/administrator") {
          return isAllowed(role, "SEE_ADMIN_MENU");
        }
        // Cek spesifik buat menu UKT
        if (item.url === "/admin/manajemen/ukt") {
          return isAllowed(role, "SEE_UKT_MENU");
        }
        return true;
      })
      .map((item) => {
        // Jika punya sub-menu (children), filter juga dalemnya secara rekursif
        if (item.children) {
          return {
            ...item,
            children: filterNavigation(item.children, role),
          };
        }
        return item;
      })
      // Buang grup menu yang isinya jadi kosong setelah di-filter
      .filter((item) => {
        if (item.children && item.children.length === 0) {
          // Jangan sembunyiin Manajemen cuma gara-gara Admin-nya ilang
          // Tapi kalau isinya emang beneran habis, baru buang
          return false;
        }
        return true;
      })
  );
};
