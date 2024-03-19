import { IssueSchema } from "@/types/issue";
import {
	getEnvRepo,
	getGithubHeader,
	searchParameterMapper,
} from "@/utils/request";
import type { ResponseFormat } from "@/utils/request";
import { array, parse } from "valibot";

const IssuesSchema = array(IssueSchema);

export async function getIssues(props: {
	milestone?: string;
	state?: "open" | "closed" | "all";
	assignee?: string;
	creator?: string;
	mentioned?: string;
	labels?: string;
	sort?: "created" | "updated" | "comments";
	direction?: string;
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
		console.log(error);
		return undefined;
	}
}
