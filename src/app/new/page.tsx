import { Editor } from "@/components/editor";
import { Login } from "@/components/login";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "New post",
	openGraph: {
		title: "New post",
	},
};

export default async function Page() {
	const cookieStore = cookies();
	const ghToken = cookieStore.get("gh_token");

	if (ghToken == null) {
		console.error("Missing GitHub auth token");
		return <NotAuthenticate />;
	}

	return (
		<main className="mx-auto max-w-3xl">
			<Editor verb="POST" />
		</main>
	);
}

function NotAuthenticate() {
	return (
		<main className="prose mx-auto">
			<h2>You're not logged in yet</h2>
			<p>Please authenticate with GitHub first, and try again.</p>
			<Login />
		</main>
	);
}
