import { Menu } from "lucide-react";
import Link from "next/link";

export default function (): React.ReactNode {
	return (
		<div className="navbar bg-base-100 border-base-200/50 fixed top-0 mx-auto border-b-2">
			<div className="dropdown">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-ghost btn-circle"
				>
					<Menu />
				</div>
				<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
					<li>
						<Link href={"#"}>Homepage</Link>
					</li>
					<li>
						<Link href={"#"}>Portfolio</Link>
					</li>
					<li>
						<Link href={"#"}>About</Link>
					</li>
				</ul>
			</div>
			<Link href={"#"} className="btn btn-ghost text-xl">
				Blog
			</Link>
			<span className="badge">commit</span>
			<input
				type="text"
				placeholder="Search"
				className="input mx-4 w-full sm:max-w-sm"
			/>
		</div>
	);
}
