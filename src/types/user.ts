import { integer, number, object, string, toMinValue, url } from "valibot";
import type { Input } from "valibot";

export const UserSchema = object({
	login: string(),
	id: number([integer(), toMinValue(1)]),
	avatar_url: string([url()]),
	html_url: string([url()]),
});

export type User = Input<typeof UserSchema>;
