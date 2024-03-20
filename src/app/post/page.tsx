import { getIssue } from "@/github/issue";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { integer, number, safeParse, toMinValue } from "valibot";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const postNumber = parsePostNumber(searchParams.number);

	if (postNumber == null) {
		notFound();
	}

	const issue = await getIssue({
		number: postNumber.toString(),
		format: "raw",
	});

	if (issue == null || issue.state === "closed") {
		notFound();
	}

	return (
		<article className="prose mx-auto max-w-xl pb-32">
			<span className="text-sm text-neutral/60">{issue.created_at}</span>
			<h1 className="prose-2xl mb-2 text-justify text-4xl font-semibold">
				{issue.title}
			</h1>
			<Link
				href={issue.user?.html_url ?? "#"}
				className="not-prose link-hover link link-neutral flex w-full items-center justify-start gap-2 underline-offset-1"
			>
				<span className="avatar">
					<span className="prose w-8 overflow-hidden rounded-full">
						<Image
							src={issue.user?.avatar_url ?? ""}
							alt={`Github User ${issue.user?.login}`}
							width={32}
							height={32}
						/>
					</span>
				</span>
				<span>@{issue.user?.login}</span>
			</Link>
			<div className="divider" />
			<Markdown
				components={{
					h1: (props) => (
						<h1 className="text-3xl">{props.children}</h1>
					),
					h2: (props) => (
						<h2 className="prose-2xl">{props.children}</h2>
					),
					h3: (props) => (
						<h3 className="prose-xl">{props.children}</h3>
					),
					h4: (props) => (
						<h4 className="prose-lg">{props.children}</h4>
					),
					h5: (props) => (
						<h5 className="prose-base">{props.children}</h5>
					),
					a: (props) => (
						<Link
							href={props.href ?? "#"}
							className="link link-primary"
						>
							{props.children}
						</Link>
					),
					img: (props) => (
						<Image
							src={props.src ?? ""}
							className="mb-2 overflow-hidden rounded-2xl"
							alt={props.alt ?? "Image without alt text"}
							fill={true}
						/>
					),
				}}
			>
				{issue.body}
			</Markdown>
		</article>
	);
}

const PageIndexSchema = number([integer(), toMinValue(1)]);

function parsePostNumber(
	page: string | string[] | undefined,
): number | undefined {
	const parsedIndex = safeParse(PageIndexSchema, Number(page));
	if (parsedIndex.success) return parsedIndex.output;
	return undefined;
}
