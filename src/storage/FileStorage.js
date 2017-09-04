import MulterFileStorage from 'multer/storage/disk'
import express from 'express'
import { pseudoRandomBytes } from 'crypto'
import mime from 'mime'
import { unlink } from 'fs'

export default class FileStorage {
    constructor(dest) {
        this.dest = dest
    }

    register(app) {
        app.use('/uploads', express.static(this.dest))
    }

    getUrl({ filename }) {
        return `${process.env.API_URL || 'http://localhost:3030'}/uploads/${filename}`
    }

    removeFile({ path }) {
        unlink(path, (err) => {
            if (err) console.log('Cannot remove file', path, err)
        })
    }

    createMulterStorage() {
        return new MulterFileStorage({
            destination: this.dest,
            filename(req, file, cb) {
                pseudoRandomBytes(16, (err, raw) => {
                    cb(err, err ? undefined : `${raw.toString('hex')}.${mime.extension(file.mimetype)}`)
                })
            }
        })
    }
}