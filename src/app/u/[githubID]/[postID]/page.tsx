export default function Page({
	params,
}: {
	params: { githubID: string; postID: string };
}) {
	return (
		<div>
			<span>id: {params.githubID}</span>
			<br />
			<span>post: {params.postID}</span>
		</div>
	);
}
