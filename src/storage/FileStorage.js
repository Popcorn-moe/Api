import express from "express";
import { pseudoRandomBytes } from "crypto";
import mime from "mime";
import { join } from "path";
import { createWriteStream } from "fs";
import { promisify } from "util";

export default class FileStorage {
	constructor(dest) {
		this.dest = dest;
	}

	register(app) {
		app.use("/uploads", express.static(this.dest));
	}

	save({ mimetype, stream }) {
		return new Promise((resolve, reject) => {
			pseudoRandomBytes(16, (err, raw) => {
				if (err) return reject(err);
				const filename = `${raw.toString("hex")}.${mime.extension(mimetype)}`;
				const fstream = createWriteStream(join(this.dest, filename));
				stream.pipe(fstream);
				stream.on("end", _ =>
					resolve(
						`${process.env.API_URL ||
							"http://localhost:3030"}/uploads/${filename}`
					)
				);
			});
		});
	}
}
