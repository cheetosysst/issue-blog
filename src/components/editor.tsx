"use client";
import { submitIssue } from "@/github/issue";
import { CircleXIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export function Editor({
	verb,
	number,
	initContent = "",
	initTitle = "",
}: {
	verb: "POST" | "PATCH";
	number?: number;
	initContent?: string;
	initTitle?: string;
}) {
	const titleRef = useRef<HTMLInputElement>(null);
	const previewRef = useRef<HTMLDialogElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const router = useRouter();

	const [errorMessageTimeout, setErrorMessageTimeout] =
		useState<Timeout | null>(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [previewContent, setPreviewContent] = useState("");

	const openPreview = () => {
		// Prevent excessive state change
		setPreviewContent(contentRef.current?.value ?? "<Empty>");
		previewRef.current?.showModal();
	};

	const submit = async () => {
		const res = await submitIssue({
			content: contentRef.current?.value ?? "",
			title: titleRef.current?.value ?? "",
			verb,
			number: number,
		});
		if (res.type === "error") {
			submitError(res.message);
			return;
		}
		router.push(res.redirectURL ?? "/");
	};
	const submitError = (message: string) => {
		if (errorMessageTimeout != null) {
			clearTimeout(errorMessageTimeout);
		}
		setErrorMessage(message);
		const timeout = setTimeout(() => setErrorMessage(""), 5000);
		setErrorMessageTimeout(timeout);
		return;
	};

	useEffect(() => {
		if (contentRef.current != null) {
			contentRef.current.value = initContent ?? "";
		}
		if (titleRef.current != null) {
			titleRef.current.value = initTitle ?? "";
		}
	}, [initContent, initTitle]);

	return (
		<div className="card mb-10 min-h-[90dvh] border-2 bg-base-100 p-10 drop-shadow-lg">
			<div className="card-body prose">
				<h2 className="flex justify-between md:items-center">
					New Article
					<span>
						<button
							type="button"
							className="btn btn-ghost btn-sm mr-2 hidden md:inline-flex"
							onClick={openPreview}
						>
							Preview
						</button>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={submit}
						>
							Submit
						</button>
					</span>
				</h2>
				<ErrorMessage message={errorMessage} />
				<label
					title="title"
					className="input input-bordered input-primary flex items-center gap-2"
				>
					<span className="text-neutral/50">Title:</span>
					<input
						type="text"
						id="articleTitle"
						className="grow"
						placeholder="Enter title..."
						ref={titleRef}
					/>
				</label>
				<textarea
					ref={contentRef}
					className="textarea textarea-bordered textarea-lg mt-2 min-h-[90dvh] w-full resize-none"
				/>
				<dialog ref={previewRef} className="modal">
					<div className="modal-box prose">
						<Preview content={previewContent} />
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>
			</div>
		</div>
	);
}

function Preview({ content }: { content: string }) {
	return (
		<Suspense fallback={<Loading />}>
			<Markdown>{content}</Markdown>
		</Suspense>
	);
}

function Loading() {
	return <progress className="progress w-56" />;
}

const Markdown = dynamic(() => import("react-markdown"), {
	ssr: false,
	loading: () => <div>Loading...</div>,
});

function ErrorMessage({ message }: { message: string }) {
	if (message.length <= 0) {
		return <></>;
	}
	return (
		<div role="alert" className="alert alert-error">
			<CircleXIcon />
			<span>{message}</span>
		</div>
	);
}
