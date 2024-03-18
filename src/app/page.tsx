import { getIssues } from "@/github/issue";
import type { Issue } from "@/types/issue";
import Link from "next/link";
import { integer, number, safeParse, toMinValue } from "valibot";

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const page = parsePageIndex(searchParams.page);

	const articles = await getIssues({ page: page, format: "text" });

	return (
		<main className="mx-auto max-w-xl">
			{articles.map((issue) => (
				<Articles key={issue.node_id} issue={issue} />
			))}
		</main>
	);
}

async function Articles({ issue }: { issue: Issue }) {
	return (
		<Link
			href={`/post?number=${encodeURI(issue.number.toString())}`}
			className="card card-compact transition-colors hover:bg-base-200"
		>
			<div className="card-body prose flex flex-col gap-2">
				<span className="line-clamp-2 flex items-center gap-2 text-ellipsis text-justify text-2xl font-bold">
					<span className="prose-base badge">#{issue.number}</span>
					<span className="prose-2xl">{issue.title}</span>
				</span>
				<span className="text-md line-clamp-2 text-ellipsis text-justify ">
					{issue.body_text}
				</span>
			</div>
		</Link>
	);
}

const PageIndexSchema = number([integer(), toMinValue(1)]);

function parsePageIndex(page: string | string[] | undefined): number {
	const parsedIndex = safeParse(PageIndexSchema, page);
	if (parsedIndex.success) return parsedIndex.output;
	return 1;
}
