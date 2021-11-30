const express = require('express');
const multer = require('multer');

const app = express();

const PORT = process.env.PORT || 80;

app.use(express.static(__dirname + '/'))

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer(storage);

app.post('/yukle', upload.any(), (req, res, next) => {

    console.log(req.files);

    res.send(req.files[0].originalname)

})



app.listen(PORT, () => console.log("Started Listening On Port " + PORT));