"use client";
import { authenticate } from "@/utils/github/auth";
import { Menu, Search } from "lucide-react";
import Link from "next/link";

export default function (): React.ReactNode {
	return (
		<div className="navbar bg-base-100 border-base-200/50 fixed top-0 mx-auto border-b-2">
			<div className="flex-1">
				<label htmlFor="my-drawer" className="btn btn-ghost btn-circle">
					<Menu />
				</label>
				<Link href={"/"} className="btn btn-ghost mr-2 text-xl">
					Blog
				</Link>
				<span className="badge">commit</span>
			</div>
			<div className="flex-none pr-2">
				<button type="button" className="btn btn-ghost">
					<Search />
				</button>
				<button
					onClick={authenticate}
					type="button"
					className="btn btn-primary"
				>
					Login
				</button>
			</div>
		</div>
	);
}
