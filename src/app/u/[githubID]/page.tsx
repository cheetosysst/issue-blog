export default function Page({ params }: { params: { githubID: string } }) {
	return <div>id: {params.githubID}</div>;
}
