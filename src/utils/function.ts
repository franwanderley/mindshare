export const decodeJwt = (token: string) => {
	try {
		const payload = token.split(".")[1];
		const base64 = payload
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map(
					(c) =>
						`%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`,
				)
				.join(""),
		);
		return JSON.parse(jsonPayload);
	} catch (_e) {
		return null;
	}
};
