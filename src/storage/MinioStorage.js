import Storage from "./Storage";
import { Client } from "minio";

export default class MinioStorage extends Storage {
	constructor({ endPoint, port, secure, accessKey, secretKey, bucketName }) {
		super();
		this.client = new Client({
			endPoint,
			port,
			secure,
			accessKey,
			secretKey
		});
		this.bucketName = bucketName;
	}

	write(filename, mimetype, stream) {
		return this.client
			.putObject(this.bucketName, filename, stream, null, mimetype)
			.then(
				_ =>
					`${this.client.protocol}//${this.client.host}:${this.client.port}/${
						this.bucketName
					}/${filename}`
			);
	}
}
