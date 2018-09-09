import fetch from "node-fetch";

//todo: some sort of 5min cache or something?
export async function rawUrl(fullUrl) {
	const res = await fetch(fullUrl);

	const text = await res.text();
	const [, url] = /<a href="(https:\/\/cdn-\d{2}.+)">/.exec(text);
	//const url = text.substring(2983, 3042)

	return url;
}

export function isBayfiles(fullUrl) {
	return (
		fullUrl.startsWith("https://bayfiles.com/") ||
		fullUrl.startsWith("https://anonfile.com/") ||
		fullUrl.startsWith("https://megaupload.nz/")
	);
}
