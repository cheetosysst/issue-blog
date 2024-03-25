"use client";
import { closeIssue } from "@/github/issue";
import { FilePenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default async function Manage({
	number,
	hidden,
}: {
	number: number;
	hidden: boolean;
}) {
	if (hidden) return <></>;
	const router = useRouter();

	const deleteHandler = async (number: number) => {
		closeIssue({ number: number });
		router.push("/");
	};

	return (
		<div className="mt-4 flex gap-2">
			<Link
				className="btn btn-outline btn-neutral btn-xs"
				title="Edit article"
				href={`/post/edit?number=${number}`}
			>
				<FilePenIcon size={16} />
				Edit
			</Link>
			<button
				type="button"
				className="btn btn-outline btn-error btn-xs"
				title="Delete article"
				onClick={() => deleteHandler(number)}
			>
				<Trash2Icon size={16} />
				Delete
			</button>
		</div>
	);
}
