"use client";

import { clearAuthToken } from "@/app/callback/action";
import { authenticate } from "@/utils/github/auth";
import { useRouter } from "next/navigation";

export function LoginComponent({ isLoggedIn }: { isLoggedIn: boolean }) {
	if (!isLoggedIn) {
		return <Login />;
	}
	return <Logout />;
}

export function Login() {
	const handler = async () => {
		await authenticate();
	};
	return (
		<button onClick={handler} type="button" className="btn btn-primary">
			Login
		</button>
	);
}

export function Logout() {
	const router = useRouter();
	const handler = async () => {
		await clearAuthToken();
		router.refresh();
	};
	return (
		<button onClick={handler} type="button" className="btn">
			Logout
		</button>
	);
}
