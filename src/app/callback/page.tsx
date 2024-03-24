"use client";

import { useRouter } from "next/navigation";
import { getOauthToken } from "./action";
import { useEffect, useState } from "react";

export default function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const state = searchParams.state;
	const code = searchParams.code;
	const router = useRouter();
	const [status, setStatus] = useState("Authenticating");

	if (
		state == null ||
		(typeof localStorage !== "undefined" &&
			state !== localStorage.getItem("ghcsrf"))
	) {
		setTimeout(() => router.push("/"), 3000);
		setStatus("CSRF token mismatch, redirecting...");
		return <div className="p-4">{status}</div>;
	}

	if (typeof code !== "string") {
		setTimeout(() => router.push("/"), 3000);
		setStatus("Code error, please retry again. Redirecting ...");
		return <div className="p-4">{status}</div>;
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: Code shouldn't change here.
	useEffect(() => {
		getOauthToken(code)
			.then(() => {
				setStatus("Authenticated, redirecting ...");
				setTimeout(() => {
					router.push("/");
				}, 1000);
			})
			.catch((error: Error) => {
				console.error(error);
				setStatus("Authentication failed");
			});
	}, []);

	return <div className="p-4">{status}</div>;
}
