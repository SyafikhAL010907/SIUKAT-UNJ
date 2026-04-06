exports.rupiah = (angka) => {
    if (angka !== undefined) {
        var value = angka.toString().replace(".", "");
        var rupiah = "";
        var angkarev = value.toString().split("").reverse().join("");
        for (var i = 0; i < angkarev.length; i++) if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
        return "Rp " + rupiah.split("", rupiah.length - 1).reverse().join("");
    }
};