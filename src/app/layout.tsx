import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { CodeXmlIcon, HomeIcon, Pencil } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Issue Blog",
		template: "%s | Issue Blog",
	},
	description: "Use GitHub repo's issue to write your blog!",
	openGraph: {
		title: {
			default: "Issue Blog",
			template: "%s | Issue Blog",
		},
		description: "Use GitHub repo's issue to write your blog!",
		url: "https://issue-blog.thect.cc",
		siteName: "Issue Blog",

		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-theme="emerald">
			<body className={`${inter.className} pt-20`}>
				<Navbar />
				<div className="drawer">
					<input
						id="my-drawer"
						type="checkbox"
						className="drawer-toggle"
					/>
					<div className="drawer-content">{children}</div>
					<div className="drawer-side">
						<label
							htmlFor="my-drawer"
							aria-label="close sidebar"
							className="drawer-overlay"
						/>
						<ul className="menu min-h-full w-80 bg-base-200 p-4 pt-20 text-base-content">
							<li>
								<Link href={"/"}>
									<HomeIcon />
									Home
								</Link>
							</li>
							<li>
								<Link
									href={
										"https://github.com/cheetosysst/issue-blog"
									}
								>
									<CodeXmlIcon />
									Github
								</Link>
							</li>
							<li>
								<Link href={"/new"}>
									<Pencil />
									New Post
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</body>
		</html>
	);
}
