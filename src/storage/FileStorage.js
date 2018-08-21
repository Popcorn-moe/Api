import Storage from "./Storage";
import express from "express";
import mime from "mime";
import { join } from "path";
import { createWriteStream } from "fs";

export default class FileStorage extends Storage {
	constructor(dest) {
		super();
		this.dest = dest;
	}

	register(app) {
		app.use("/uploads", express.static(this.dest));
	}

	write(filename, mimetype, stream) {
		return new Promise((resolve, reject) => {
			const file = `${filename.replace("?", "")}.${mime.getExtension(
				mimetype
			)}`;
			const wstream = createWriteStream(join(this.dest, file));
			stream.pipe(wstream);
			stream.on("end", _ =>
				resolve(
					`${process.env.API_URL ||
						"http://localhost:3030"}/uploads/${file}?${new Date().getTime()}`
				)
			);
			stream.on("error", reject);
		});
	}
}
