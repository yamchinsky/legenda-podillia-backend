const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req, res) => {
  res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
});

app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read files' });
    }

    const fileList = files.map((file) => ({
      name: file,
      url: `http://164.92.206.163:3000/uploads/${file}`,
    }));
    res.status(200).json(fileList);
  });
});

app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
