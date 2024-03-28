import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Not Found",
	description: "Are you lost?",
};

export default async function Page() {
	return (
		<main className="prose mx-auto max-w-xl">
			<h1 className="m-10 text-center text-error">404</h1>
			<p className="mb-5 text-center">
				<b>Are you lost?</b>
			</p>
			<p className="text-center">
				<Link
					className="btn btn-primary btn-sm"
					title="Country road take me home"
					href={"/"}
				>
					Country road, take me home
				</Link>
			</p>
		</main>
	);
}
