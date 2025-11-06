import FormData from "form-data";
import Jimp from "jimp";

let handler = async (m, { conn, usedPrefix, command }) => {
	switch (command) {
		case "dehaze":
			{
				conn.enhancer = conn.enhancer || {};
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime) throw "Please reply or send a photo!";
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `Unsupported file type: ${mime}`;
				else conn.enhancer[m.sender] = true;

				m.reply("Processing your image, please wait...");
				let img = await q.download?.();
				let error;
				try {
					const result = await processing(img, "dehaze");
					conn.sendFile(m.chat, result, "", "Here’s your enhanced image!", m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Failed to process image :(");
					}
					delete conn.enhancer[m.sender];
				}
			}
			break;

		case "recolor":
			{
				conn.recolor = conn.recolor || {};
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime) throw "Please reply or send a photo!";
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `Unsupported file type: ${mime}`;
				else conn.recolor[m.sender] = true;

				m.reply("Processing your image, please wait...");
				let img = await q.download?.();
				let error;
				try {
					const result = await processing(img, "recolor");
					conn.sendFile(m.chat, result, "", "Here’s your recolored image!", m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Failed to process image :(");
					}
					delete conn.recolor[m.sender];
				}
			}
			break;

		case "hdr":
			{
				conn.hdr = conn.hdr || {};
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime) throw "Please reply or send a photo!";
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `Unsupported file type: ${mime}`;
				else conn.hdr[m.sender] = true;

				m.reply("Enhancing your photo in HD, please wait...");
				let img = await q.download?.();
				let error;
				try {
					const result = await processing(img, "enhance");
					conn.sendFile(m.chat, result, "", "WATSON-XD-BOT HD ENHANCER COMPLETE!", m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Failed to process image :(");
					}
					delete conn.hdr[m.sender];
				}
			}
			break;
	}
};

handler.help = ["dehaze", "recolor", "hdr"];
handler.tags = ["tools"];
handler.command = ["dehaze", "recolor", "hdr"];

export default handler;

async function processing(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		if (!Methods.includes(method)) method = "enhance";

		let Form = new FormData();
		let endpoint = `https://inferenceengine.vyro.ai/${method}`;

		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=utf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "image_input.jpg",
			contentType: "image/jpeg",
		});

		Form.submit(
			{
				url: endpoint,
				host: "inferenceengine.vyro.ai",
				path: `/${method}`,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) return reject();
				let data = [];
				res.on("data", (chunk) => data.push(chunk));
				res.on("end", () => resolve(Buffer.concat(data)));
				res.on("error", () => reject());
			}
		);
	});
}