const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
app.use(express.json());
dotenv.config();
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
  });

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    },
    region : BUCKET_REGION
});

// Upload endpoint, uses /api/UserAvatar/upload
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file.' });
    }
  
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.file.originalname, 
      Body: req.file.buffer, 
      ContentType: req.file.mimetype,
    };
  
    try {
      const command = new PutObjectCommand(params);
      const response = await s3.send(command);
      res.send({
        message: 'File uploaded successfully',
        data: response,
      });
    } catch (error) {
      console.error('S3 upload error:', error);
      res.status(500).send({ message: 'Error uploading to S3', error: error.message });
    }
});

module.exports = router;
  
