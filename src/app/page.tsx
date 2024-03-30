"use server";
import { getIssues } from "@/github/issue";
import { InfiniteArticles } from "./infinite";
import { Articles, Skeleton } from "./article";
import type { Issue } from "@/types/issue";
import { Suspense } from "react";

export default async function Home() {
	const articles = getIssues({
		page: 1,
		format: "text",
		state: "open",
		per_page: 10,
	});

	return (
		<main className="mx-auto mb-32 max-w-2xl">
			<Suspense fallback={<ArticleSkeletons />}>
				<InitialArticles articles={articles} />
			</Suspense>
			<InfiniteArticles />
		</main>
	);
}

async function ArticleSkeletons() {
	"use server";
	return (
		<>
			{new Array(10).fill(undefined).map((_, index) => (
				<Skeleton key={`skeleton${index}`} />
			))}
		</>
	);
}

async function InitialArticles(props: { articles: Promise<Array<Issue>> }) {
	const articles = await props.articles;
	return (
		<>
			{articles.map((issue) => (
				<Articles key={issue.node_id} issue={issue} />
			))}
		</>
	);
}
