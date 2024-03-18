import Link from "next/link";

export default async function Page() {
	return (
		<main className="mx-auto max-w-xl">
			<h1 className="m-10 text-center text-5xl font-extrabold text-error">
				404
			</h1>
			<p className="mb-5 text-center">Are you lost?</p>
			<p className="text-center">
				<Link className="btn btn-primary btn-sm" href={"/"}>
					Yes, please take me home
				</Link>
			</p>
		</main>
	);
}
