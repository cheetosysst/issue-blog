"use server";
import { cookies } from "next/headers";

export async function getOauthToken(code: string) {
	if (typeof process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID !== "string") {
		throw new Error("Client Id Missing");
	}
	if (typeof process.env.GITHUB_CLIENT_SECRET !== "string") {
		throw new Error("Client Secret Not Found");
	}

	const codeExchangeURL = generateCodeExchangeURL({
		id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
		secret: process.env.GITHUB_CLIENT_SECRET as string,
		code: code,
	});

	const headers = new Headers();
	headers.append("Accept", "application/json");

	try {
		const result = await fetch(codeExchangeURL, {
			method: "post",
			credentials: "include",
			headers: headers,
		});
		if (!result.ok)
			throw new Error(
				`Failed retrieving token from Github ${result.status} ${result.statusText}`,
			);
		const parsedResult = await result.json();

		const token = parsedResult.access_token as string;

		// This is a dumb solution to prevent client-side useEffect triggering twice, causing the token to be reset by error.
		token != null &&
			cookies().set({
				name: "gh_token",
				sameSite: "lax",
				value: token,
			});
	} catch (error) {
		console.error(error);
		throw new Error("Failed retrieving token from Github");
	}
}

function generateCodeExchangeURL({
	id,
	secret,
	code,
}: {
	id: string;
	secret: string;
	code: string;
}): string {
	const codeExchangeURL = new URL(
		"https://github.com/login/oauth/access_token",
	);
	codeExchangeURL.searchParams.append("client_id", id);
	codeExchangeURL.searchParams.append("client_secret", secret);
	codeExchangeURL.searchParams.append("code", code);
	return codeExchangeURL.toString();
}
