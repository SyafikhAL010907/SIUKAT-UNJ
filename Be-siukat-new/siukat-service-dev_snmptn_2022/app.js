var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var pdf = require("express-pdf");

var index = require("./routes/index");
var admin = require("./routes/admin");
var users = require("./routes/users");
var cmahasiswa = require("./routes/cmahasiswa");
var ayah = require("./routes/ayah");
var ibu = require("./routes/ibu");
var kendaraan = require("./routes/kendaraan");
var listrik = require("./routes/listrik");
var pendukung = require("./routes/pendukung");
var rumah = require("./routes/rumah");
var wali = require("./routes/wali");
var captcha = require("./routes/captcha");
var fakultas = require("./routes/fakultas");
var prodi = require("./routes/prodi");
var provinsi = require("./routes/provinsi");
var kabkot = require("./routes/kabkot");
var kecamatan = require("./routes/kecamatan");
var pekerjaan = require("./routes/pekerjaan");
var pdfRoute = require("./routes/pdf");
var info = require("./routes/info");
var ukt = require("./routes/ukt");
var verifikasi = require("./routes/verifikasi");
var dashboardapi = require("./routes/dashboardapi");
var summarydata = require("./routes/summary");
var agama = require("./routes/bio_agama");
var pendidikan = require("./routes/bio_pendidikan");
var penghasilan = require("./routes/bio_penghasilan");
var jurusan = require("./routes/bio_jurusan");
var tinggal = require("./routes/bio_tinggal");
var transportasi = require("./routes/bio_transportasi");
var biodata_cmahasiswa = require("./routes/bio_cmahasiswa");
var ortu_cmahasiswa = require("./routes/bio_ortu_cmahasiswa");
var sekolah_cmahasiswa = require("./routes/bio_sekolah_cmahasiswa");
var ref_sekolah = require("./routes/bio_ref_sekolah");
var keringanan = require("./routes/keringanan");

var User = require("./models/user");

var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
const SECRET = require("./constants/secret");

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = SECRET;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log("payload received", jwt_payload);
    // usually this would be a database call:
    User.findOne({
        attributes: ["no_peserta"],
        where: {
            no_peserta: jwt_payload.id,
        },
    }).then((user) => {
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
});

passport.use(strategy);

var app = express();
app.use(passport.initialize());
app.use(pdf);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(
    cors({
        origin: [
            // "http://localhost:3000",
            // "http://localhost:3001",
            // "http://192.168.16.88:3000",
            // "http://localhost:3002",
            // "http://192.168.16.183:3001",
            // "http://192.168.16.97:3000",
            // "http://siukat.unj.ac.id:8081",
            "http://siukat.unj.ac.id",
            // "http://192.168.4.94",
            // "http://103.8.12.101:3000",
            // "http://103.8.12.212:39180",
            // "http://192.168.9.116:5000",
            // "http://192.168.4.97",
            // "http://192.168.9.178",
            // "http://103.8.12.212:37580",
            // "http://172.32.240.94"
        ],
    })
);
// app.use(cors({ origin: '*' }))
//online info
app.use("/info", info);
app.use("/users", users);

//TURN ONLINE ON
// var deploy = if(req.headers['x-forwarded-for'])
// var deploy = false;
var deploy = true;

if (deploy) {
    app.use("/", index);
    app.use("/admin", admin);
    app.use("/cmahasiswa", cmahasiswa);
    app.use("/ayah", ayah);
    app.use("/ibu", ibu);
    app.use("/kendaraan", kendaraan);
    app.use("/listrik", listrik);
    app.use("/pendukung", pendukung);
    app.use("/rumah", rumah);
    app.use("/wali", wali);
    app.use("/captcha", captcha);
    app.use("/fakultas", fakultas);
    app.use("/prodi", prodi);
    app.use("/provinsi", provinsi);
    app.use("/kabkot", kabkot);
    app.use("/kecamatan", kecamatan);
    app.use("/pekerjaan", pekerjaan);
    app.use("/pdf", pdfRoute);
    app.use("/ukt", ukt);
    app.use("/verifikasi", verifikasi);
    app.use("/dashboard", dashboardapi);
    app.use("/summary", summarydata);
    app.use("/agama", agama);
    app.use("/pendidikan", pendidikan);
    app.use("/penghasilan", penghasilan);
    app.use("/jurusan", jurusan);
    app.use("/tinggal", tinggal);
    app.use("/transportasi", transportasi);
    app.use("/biodata/cmahasiswa", biodata_cmahasiswa);
    app.use("/ortu/cmahasiswa", ortu_cmahasiswa);
    app.use("/sekolah/cmahasiswa", sekolah_cmahasiswa);
    app.use("/ref-sekolah", ref_sekolah);
    app.use("/keringanan", keringanan);
} else {
    app.use(function (req, res, next) {
        var err = new Error("Service Offline");
        err.status = 503;
        next(err);
    });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
