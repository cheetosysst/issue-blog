"use client";
export default function ClientTitle({ title }: { title: string }) {
	if (typeof window !== "undefined") document.title = `${title} | Issue Blog`;
	return <></>;
}
