"use server";
import { IssueSchema } from "@/types/issue";
import {
	getEnvRepo,
	getGithubHeader,
	searchParameterMapper,
} from "@/utils/request";
import type { ResponseFormat } from "@/utils/request";
import { array, parse } from "valibot";
import { getCredential } from "./user";

const IssuesSchema = array(IssueSchema);

export async function getIssues(props: {
	milestone?: string;
	state?: "open" | "closed" | "all";
	assignee?: string;
	creator?: string;
	mentioned?: string;
	labels?: string;
	sort?: "created" | "updated" | "comments";
	direction?: "desc" | "asc";
	since?: Date | string;
	page?: number;
	per_page?: number;
	format?: ResponseFormat;
}) {
	const format = props.format ? props.format : "raw";
	const headers = getGithubHeader({ format: format });
	const url = new URL(`https://api.github.com/repos/${getEnvRepo()}/issues`);
	searchParameterMapper(url, props);

	const response = await fetch(url.toString(), {
		headers,
	}).catch((error) => {
		console.error(error);
		return undefined;
	});

	if (response == null) {
		return [];
	}

	if (!response.ok) {
		console.error(`Failed retrieving data from endpoint ${response.url}`);
		return [];
	}

	const rawData = await response.json();
	try {
		const issues = parse(IssuesSchema, rawData);
		return issues;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getIssue(props: {
	number: string;
	format?: ResponseFormat;
}) {
	const format = props.format ? props.format : "raw";
	const headers = getGithubHeader({ format: format });
	const url = new URL(
		`https://api.github.com/repos/${getEnvRepo()}/issues/${props.number}`,
	);

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
		console.error(`Failed retriving data from endpoint ${response.url}`);
		return undefined;
	}

	const rawData = await response.json();

	try {
		const issue = parse(IssueSchema, rawData);
		return issue;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export const submitIssue = async (props: {
	content: string;
	title: string;
	verb: "POST" | "PATCH";
	number?: number;
}) => {
	if (props.title.length < 1) {
		return {
			type: "error",
			message: "Empty title",
		};
	}
	if (props.content.length < 30) {
		return {
			type: "error",
			message: "Body requires at least 30 characters",
		};
	}

	const headers = getGithubHeader({});
	const url = new URL(
		`https://api.github.com/repos/${getEnvRepo()}/issues${props.number != null && props.verb === "PATCH" ? `/${props.number}` : ""}`,
	);

	const body: Record<string, string> = {
		title: props.title,
		body: props.content,
	};

	const response = await fetch(url.toString(), {
		headers,
		method: props.verb,
		body: JSON.stringify(body),
	}).catch((error) => {
		console.error(error);
		return undefined;
	});

	if (response == null) {
		return {
			type: "error",
			message: "Submit failed, please try again later",
		};
	}

	const data = await response.json();

	try {
		const issue = parse(IssueSchema, data);
		return {
			type: "success",
			message: "Success",
			redirectURL: `/post?number=${issue.number}`,
		};
	} catch (error) {
		console.error(error);
		return {
			type: "error",
			message: "Unknown error, please try again later.",
		};
	}
};

export async function closeIssue({ number }: { number: number }) {
	const credentials = await getCredential();
	if (credentials == null) throw new Error("Not authenticated");

	const issue = await getIssue({ number: number.toString() });
	if (issue == null) {
		throw new Error("Article doesn't exist");
	}

	if (issue.user?.login !== credentials.login) {
		throw new Error("Not original author");
	}

	if (issue.state === "closed") {
		throw new Error("Already closed");
	}

	const headers = getGithubHeader({});
	const url = new URL(
		`https://api.github.com/repos/${getEnvRepo()}/issues/${number}`,
	);

	const response = await fetch(url.toString(), {
		headers,
		method: "PATCH",
		body: JSON.stringify({
			state: "closed",
		}),
	}).catch((error) => {
		console.error(error);
		throw new Error("Failed deleting the aritcle");
	});

	return response.json();
}
