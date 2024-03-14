import { generateCSRF } from "../csrf";

export async function authenticate() {
	const clientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
	console.log(process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
	if (clientID == null) {
		// TODO Error message
		throw new Error("github oauth client id missing");
	}
	if (localStorage == null) {
		return;
	}

	const csrfToken = generateCSRF();
	localStorage.setItem("ghcsrf", csrfToken);

	const redirectTarget = new URL("https://github.com/login/oauth/authorize");
	redirectTarget.searchParams.append("client_id", clientID);
	redirectTarget.searchParams.append("state", csrfToken);
	if (process.env.NODE_ENV === "development")
		redirectTarget.searchParams.append(
			"redirect_uri",
			"http://127.0.0.1:3000/callback",
		);

	const redirectURL = redirectTarget.toString();
	window.location.assign(redirectURL);
}
