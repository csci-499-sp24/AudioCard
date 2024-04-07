const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const sharp = require('sharp');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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
    region: BUCKET_REGION
});

// Upload endpoint, uses /api/UserAvatar/upload
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No File Found' });
    }

    const username = req.body.username; 
    const fileExtension = req.file.originalname.split('.').pop();
    const newFileName = `${username}_avatar.jpg`;

    sharp(req.file.buffer)
    .toFormat('jpg')
    .jpeg({ quality: 90 }) 
    .toBuffer()
    .then((buffer) => {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: newFileName,
        Body: buffer,
        ContentType: 'image/jpeg',
      };

      const command = new PutObjectCommand(params);

      return s3.send(command);
    })
    .then(() => {
      res.send({
        message: 'Avatar uploaded successfully',
        filename: newFileName,
      });
    })
    .catch((error) => {
      console.error('Error processing image or uploading to S3:', error);
      res.status(500).send({ message: 'Error uploading avatar to S3', error: error.message });
    });
});

router.get('/avatar/:username', async (req, res) => {
    const username = req.params.username;
    const key = `${username}_avatar.jpg`;
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 30 }); 
        res.send({ url });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).send({ message: 'Error generating presigned URL', error: error.message });
    }
});

module.exports = router;

