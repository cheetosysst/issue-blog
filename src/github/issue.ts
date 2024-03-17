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
	state?: string;
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
