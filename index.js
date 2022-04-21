const express = require('express');
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => res.redirect('/public/index.html'))


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'tmp/')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage });
const defaultPath = __dirname + '/uploads/';


app.get('/dosyalar', (req, res, next) => {

  // console.log(req.query)

  try {
    res.send(fs.readdirSync(defaultPath + req.query.path).filter(file => !file.startsWith('.'))) //ismi . ile başlayan dosyaları gizledik (.gitkeep gibi)
  }
  catch (err) {
    res.send({
      error: true,
      message: err
    });
  }
})

app.post('/dosyalar', upload.any(), async (req, res, next) => {

  const files = req.files;

  let errors = [];

  for (let i = 0; i < files.length; i++) {

    try {
      const file_name = files[i].originalname;

      await fs.renameSync(__dirname + "/tmp/" + file_name, defaultPath + req.query.path + "/" + file_name);
    }

    catch (err) {
      console.error(err);

      errors.push(`${file_name} yüklemesi basarısız`)
    }

  }

  if (errors.length > 0)
    return res.status(400).send(errors);

  else res.send(`<script> window.onload = () => { history.back() } </script> `)

})

app.delete('/dosyalar', async (req, res, next) => {

  const { path } = req.query;

  try {
    if (path.includes('.'))
      await fs.unlinkSync(defaultPath + path)
    else
      await fs.rmdirSync(defaultPath + path, { recursive: true, force: true });

    res.send("Silme İşlemi Başarılı");
  }
  catch (err) {

    console.log(err)

    res.send("Dosya Silmede Hata!");
  }
})

app.get('/rename', async (req, res, next) => { //rename?path=eskikonum&newPath=yeniKonum


  try {
    const { path, newName } = req.query;

    await fs.renameSync(defaultPath + path, defaultPath + path.split('/').slice(1, path.split('/').length - 1).join('/') + "/" + newName);

    res.send("Yeniden Adlandırma Başarılı");

  }
  catch (err) {

    console.error(err);

    res.status(400).send("Yeniden Adlandırmada Hata!");
  }

})


app.get('/yeniKlasor', async (req, res) => {

  const { path } = req.query;

  try {

    await fs.mkdirSync(defaultPath + path);

    res.send("Klasör Oluşturma Başarılı");

  }
  catch (err) {

    console.error(err);
    res.status(400).send("Klasör Oluşturmada Hata!");

  }

})

app.listen(PORT, () => console.log("Started Listening On Port " + PORT));