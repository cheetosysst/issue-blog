export function generateCSRF() {
	const array = new Uint8Array(16);
	const state = crypto.getRandomValues(array);
	return state.toString();
}
