import { Menu, PencilIcon, Search } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { LoginComponent } from "./login";

export default async function Navbar() {
	const cookieStore = cookies();
	const ghToken = cookieStore.get("gh_token")?.value;

	return (
		<div className="navbar fixed top-0 z-10 mx-auto border-b-2 border-base-200/50 bg-base-100">
			<div className="flex-1">
				<label htmlFor="my-drawer" className="btn btn-circle btn-ghost">
					<Menu />
				</label>
				<Link href={"/"} className="btn btn-ghost mr-2 text-xl">
					Blog
				</Link>
				<span className="badge">commit</span>
			</div>
			<div className="flex flex-none gap-2 pr-2">
				<button
					type="button"
					aria-label="search button"
					title="Search Button"
					className="btn btn-ghost"
				>
					<Search />
				</button>
				<NewPost hidden={typeof ghToken !== "string"} />
				<LoginComponent isLoggedIn={ghToken != null} />
			</div>
		</div>
	);
}

function NewPost({ hidden }: { hidden: boolean }) {
	if (hidden) return null;
	return (
		<Link href={"/new"} className="btn btn-primary">
			<PencilIcon strokeWidth={1.75} size={22} />
		</Link>
	);
}
