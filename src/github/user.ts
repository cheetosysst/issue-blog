"use server";

import { UserSchema } from "@/types/user";
import { getGithubHeader } from "@/utils/request";
import { cookies } from "next/headers";
import { parse } from "valibot";

export async function getUser({ token }: { token?: string }) {
	const headers = getGithubHeader({});
	if (token != null) headers.set("Authorization", `Bearer ${token}`);
	const url = new URL("https://api.github.com/user");

	const response = await fetch(url.toString(), {
		headers,
	}).catch((error) => {
		console.error(error);
		return undefined;
	});

	if (response == null) {
		return undefined;
	}

	if (!response.ok) {
		console.error(`Failed retrieving data from endpoint ${response.url}`);
		return undefined;
	}

	const rawData = await response.json();
	try {
		const user = parse(UserSchema, rawData);
		return user;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export async function getCredential() {
	const cookieStore = cookies();
	const token = cookieStore.get("gh_token")?.value;
	const login = cookieStore.get("gh_user")?.value;

	if (token == null || login == null) return undefined;
	return { token, login };
}
