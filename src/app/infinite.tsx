"use client";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

export default function Infinite() {
	const { ref, entry } = useIntersection({
		threshold: 0.5,
	});

	useEffect(() => {
		if (!entry) return;
		console.log("flag");
	}, [entry]);

	return (
		<>
			{entry?.isIntersecting ? "in view" : ""}
			<span className="h-10 w-full bg-transparent" ref={ref} />
		</>
	);
}
