const router = require('express').Router();
const { uploadImage, fileUploadFromCloudinary, getImage, deleteImage, updateImage } = require('../controller/userController');

router.post('/', fileUploadFromCloudinary, uploadImage);
router.get('/', getImage);
router.put('/:id', fileUploadFromCloudinary, updateImage)
router.delete('/:id', fileUploadFromCloudinary, deleteImage)
module.exports = router;