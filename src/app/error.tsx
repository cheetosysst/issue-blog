"use client";
// Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
	error,
}: {
	error: Error & { digest?: string };
}) {
	const router = useRouter();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong!</h2>
			<button
				type="button"
				className="btn btn-primary"
				onClick={() => router.push("/")}
			>
				To home
			</button>
		</div>
	);
}
