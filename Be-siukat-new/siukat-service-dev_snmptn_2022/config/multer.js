var multer  = require('multer')
var fs = require('fs')
var moment = require('moment')

var multerConf = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      if(!file) next(null, true)
      
      const no_peserta = req.params.no_peserta != null ? req.params.no_peserta : req.user.no_peserta
      const dirname = "public/uploads/"+no_peserta+"/"
      if(!fs.existsSync(dirname)){
        fs.mkdirSync(dirname)
      }
      next(null, dirname)
    },
    filename: (req, file, next) => {
      if(!file) next(null, true)

      const no_peserta = req.params.no_peserta != null ? req.params.no_peserta : req.user.no_peserta     

      const ext = file.mimetype.split('/')[1]
      const dirname = "public/uploads/"+no_peserta+"/"
      var filename = file.fieldname + '-' + no_peserta + '-' + moment().format('DDMMYYYYHHmmss') + '.' + ext

      fs.readdir(dirname, function(err, files) {
          if (err) return;
          files.forEach(function(f) {
            if(f.startsWith(file.fieldname)) fs.unlinkSync(dirname+f)
          });
      })

      next(null, filename)
    }
  }),
  fileFilter: (req, file, next) => {
    const valid = (file.fieldname.startsWith("file_scan")) ? file.mimetype.startsWith('application/pdf') : file.mimetype.startsWith('image/')
    if(valid){
      next(null, true)
    }else{
      next({message: "File type is not supported"}, false)
    }
  }
}

module.exports = multerConf
