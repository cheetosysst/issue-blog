import { getIssue } from "@/github/issue";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { integer, number, safeParse, toMinValue } from "valibot";
import { cookies } from "next/headers";
import Manage from "./edit/manageArticle";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";

type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
	searchParams,
}: Props): Promise<Metadata> {
	const postNumber = parsePostNumber(searchParams.number);

	if (postNumber == null)
		return {
			title: "Not Found",
		};

	const issue = await getIssue({
		number: postNumber.toString(),
		format: "raw",
	});

	return {
		title: issue?.title || "Not Found",
	};
}

export default async function Page({ searchParams }: Props) {
	const cookieStore = cookies();
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

	const username = cookieStore.get("gh_user")?.value;

	return (
		<article className="prose mx-auto max-w-xl pb-32">
			<span className="text-sm text-neutral/60">{issue.created_at}</span>
			<h1 className="prose-2xl mb-2 text-justify text-4xl font-semibold">
				{issue.title || "Untitled post"}
			</h1>
			<Link
				href={issue.user?.html_url ?? "#"}
				title={`Visit @${issue.user?.login}'s GitHub profile`}
				className="not-prose link-hover link link-neutral flex w-full items-center justify-start gap-2 underline-offset-1"
			>
				<span className="avatar w-8 overflow-hidden rounded-full">
					<Image
						src={issue.user?.avatar_url ?? ""}
						alt={`Github User ${issue.user?.login}`}
						width={32}
						height={32}
					/>
				</span>
				<span>@{issue.user?.login}</span>
			</Link>

			<Manage
				number={issue.number}
				hidden={username !== issue.user?.login}
			/>

			<div className="divider" />
			{(issue.body == null || !issue.body.length) && (
				<p className="italic">{"<Empty>"}</p>
			)}
			<Markdown
				className="overflow-hidden text-ellipsis text-justify"
				remarkPlugins={[remarkGfm]}
				components={{
					h1: (props) => (
						<h1
							className="text-3xl"
							id={props.children?.toString().toLowerCase()}
						>
							{props.children}
						</h1>
					),
					h2: (props) => (
						<h2
							className="prose-2xl"
							id={props.children?.toString().toLowerCase()}
						>
							{props.children}
						</h2>
					),
					h3: (props) => (
						<h3
							className="prose-xl"
							id={props.children?.toString().toLowerCase()}
						>
							{props.children}
						</h3>
					),
					h4: (props) => (
						<h4
							className="prose-lg"
							id={props.children?.toString().toLowerCase()}
						>
							{props.children}
						</h4>
					),
					h5: (props) => (
						<h5
							className="prose-base"
							id={props.children?.toString().toLowerCase()}
						>
							{props.children}
						</h5>
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
