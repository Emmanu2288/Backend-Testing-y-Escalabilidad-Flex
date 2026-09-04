import fs from 'fs'
import multer from 'multer'
import path from 'path'

const uploadFolders = [
    'uploads/documents',
    'uploads/proofs',
    'uploads/licenses'
]
uploadFolders.forEach((folder) => fs.mkdirSync(folder, { recursive: true }))

const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/documents'
        if (file.fieldname === 'proof') {
            folder = 'uploads/proofs'
        } else if (file.fieldname === 'license') {
            folder = 'uploads/licenses'
        }
        cb(null, folder)
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname)
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('INVALID_FILE_TYPE'))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload
