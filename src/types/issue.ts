import {
	integer,
	url,
	number,
	object,
	string,
	toMinValue,
	minValue,
	union,
	literal,
	type Input,
	optional,
	nullable,
} from "valibot";
import { UserSchema } from "./user";

export const IssueSchema = object({
	id: number([integer(), toMinValue(1)]),
	node_id: string(),
	url: string([url()]),
	repository_url: string([url()]),
	labels_url: string([url()]),
	comments_url: string([url()]),
	events_url: string([url()]),
	html_url: string([url()]),
	number: number([integer(), minValue(1)]),
	state: union([literal("open"), literal("closed")]),
	state_reason: nullable(
		union([
			literal("completed"),
			literal("reopened"),
			literal("not_planned"),
		]),
	),
	title: string(),
	body: optional(string()),
	body_text: optional(string()),
	user: optional(union([UserSchema])),
	created_at: string([]),
});

export type Issue = Input<typeof IssueSchema>;
