import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const data = await request.json();
	const code = data.code as unknown as string;
	const cookieStore = cookies();
	if (typeof code !== "string") {
		return new Response("Incorrect params", {
			status: 401,
		});
	}
	if (typeof process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID !== "string") {
		return new Response("", {
			status: 500,
		});
	}
	if (typeof process.env.GITHUB_CLIENT_SECRET !== "string") {
		return new Response("", {
			status: 500,
		});
	}

	const codeExchangeURL = generateCodeExchangeURL({
		id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
		secret: process.env.GITHUB_CLIENT_SECRET as string,
		code: code,
	});

	const headers = new Headers();
	headers.append("Accept", "application/json");

	try {
		const result = await fetch(codeExchangeURL.toString(), { headers });
		const parsedResult = await result.json();
		console.log(parsedResult);
		cookieStore.set("gh_token", parsedResult.access_token);
		return new Response(parsedResult.access_token);
	} catch {
		return new Response("Error retriving OAUTH token", {
			status: 500,
		});
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
}): URL {
	const codeExchangeURL = new URL(
		"https://github.com/login/oauth/access_token",
	);
	codeExchangeURL.searchParams.append("client_ID", id);
	codeExchangeURL.searchParams.append("client_secret", secret);
	codeExchangeURL.searchParams.append("code", code);
	return codeExchangeURL;
}
