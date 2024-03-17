import { cookies } from "next/headers";

const API_VER = "2022-11-28";

export type ResponseFormat = "raw" | "text" | "html" | "full";

/**
 * Generates headers for making api request to github
 */
export function getGithubHeader({
	format = "raw",
}: {
	format?: ResponseFormat;
}): Headers {
	const cookieStore = cookies();
	const header = new Headers();

	const oauthToken = cookieStore.get("gh_token")?.value;

	header.append("Accept", `application/vnd.github.${format}+json`);
	header.append("X-GitHub-Api-Version", API_VER);

	if (typeof oauthToken === "string") {
		header.append("Authorization", `Bearer ${cookieStore}`);
	}

	return header;
}

export function getEnvRepo() {
	const repo = process.env.REPO;
	if (repo == null) throw new Error("REPO not found in ENV.");
	return repo;
}

export function searchParameterMapper(
	target: URL,
	parameters: Record<string, string | number | Date>,
) {
	const entries = Object.entries(parameters);

	for (const [key, value] of entries) {
		if (typeof value === "number") {
			target.searchParams.append(key, value.toString());
			continue;
		}
		if (value instanceof Date) {
			target.searchParams.append(key, value.toISOString());

			continue;
		}
		target.searchParams.append(key, value);
	}

	return target;
}
