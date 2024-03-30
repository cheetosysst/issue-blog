import type { Issue } from "@/types/issue";
import Link from "next/link";

export function Articles({ issue }: { issue: Issue }) {
	return (
		<Link
			href={`/post?number=${encodeURI(issue.number.toString())}`}
			className="card card-compact transition-colors hover:bg-base-200 hover:drop-shadow"
			title={issue.title || "Untitled Post"}
		>
			<div className="card-body prose flex flex-col gap-2">
				<span className="line-clamp-2 flex items-center gap-2 text-ellipsis text-justify text-2xl font-bold">
					<span
						className={
							"badge badge-primary prose-base tabular-nums drop-shadow-lg"
						}
					>
						#{issue.number}
					</span>
					<span className="prose-2xl line-clamp-1">
						{issue.title || "Untitled Post"}
					</span>
				</span>
				<span className="text-md line-clamp-2 text-ellipsis text-justify ">
					{issue.body_text || (
						<span className="italic">{"<Empty>"}</span>
					)}
				</span>
			</div>
		</Link>
	);
}
export function Skeleton() {
	return (
		<div className="card-body prose flex flex-col gap-2">
			<span className="line-clamp-2 flex items-center gap-2 text-ellipsis text-justify text-2xl font-bold">
				<div className="skeleton w-12 bg-primary drop-shadow-lg" />
				<div className="skeleton h-4 w-full" />
			</span>
			<div className="skeleton h-5 w-full" />
			<div className="skeleton h-5 w-full" />
		</div>
	);
}
