const multer = require('multer')

const uploader = multer({
	limits: {
		fileSize: 1000000,
		files: 1
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
			cb(new Error('Please upload an jpg, jpeg, png or webp file'))
		}
		req.user.picMime = file.mimetype
		cb(undefined, true)
	}
})

module.exports = uploader.single('pic')
