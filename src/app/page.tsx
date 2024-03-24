import { getIssues } from "@/github/issue";
import { InfiniteArticles } from "./infinite";
import { Articles } from "./article";

export default async function Home() {
	const articles = await getIssues({
		page: 1,
		format: "text",
		state: "open",
		per_page: 10,
	});

	return (
		<main className="mx-auto mb-32 max-w-2xl">
			{articles.map((issue) => (
				<Articles key={issue.node_id} issue={issue} />
			))}
			<InfiniteArticles />
		</main>
	);
}
