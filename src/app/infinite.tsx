"use client";
import { getIssues } from "@/github/issue";
import type { Issue } from "@/types/issue";
import { useIntersection } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Articles } from "./article";

export function InfiniteArticles() {
	const { ref, entry } = useIntersection({
		threshold: 0.5,
	});

	const [page, setPage] = useState<number>(2);

	const [articles, setArticles] = useState<Array<Issue>>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need to add `page` to dep and cause infinite loop
	useEffect(() => {
		if (entry == null) return;
		if (!entry.isIntersecting) return;
		getIssues({
			page: page,
			format: "text",
			state: "open",
			per_page: 10,
		})
			.then((data) => {
				setArticles((current) => current.concat(data));
				if (data.length) setPage((current) => current + 1);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [entry]);

	return (
		<>
			{articles.map((issue) => (
				<Articles key={issue.node_id} issue={issue} />
			))}
			<div className="h-32 w-full bg-transparent" ref={ref} />
		</>
	);
}
