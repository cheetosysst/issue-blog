"use server";

import { UserSchema } from "@/types/user";
import { getGithubHeader } from "@/utils/request";
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
