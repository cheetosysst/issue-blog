import { Editor } from "@/components/editor";
import { getIssue } from "@/github/issue";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const number = Number(searchParams.number);
	if (Number.isNaN(number) || number < 0) notFound();

	const issue = await getIssue({
		number: number.toString(),
		format: "full",
	}).catch((error) => {
		console.error(error);
		notFound();
	});

	if (issue?.user?.login === cookies().get("gh_user")) {
		throw Error("Forbidden");
	}

	return (
		<main className="mx-auto max-w-3xl">
			<Editor
				verb="PATCH"
				initContent={issue?.body || ""}
				initTitle={issue?.title || ""}
				number={issue?.number}
			/>
		</main>
	);
}
