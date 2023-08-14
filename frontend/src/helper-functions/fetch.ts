

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>;
}

export default async function apiFetch(endpoint: string, options: FetchOptions = {}) {
console.log(import.meta.env.PUBLIC_API_URL + endpoint);

	const defaultHeaders = {
			"Content-Type": "application/json",
	};

	const response = await fetch(`${import.meta.env.PUBLIC_API_URL}${endpoint}`, {
			...options,
			headers: {
					...defaultHeaders,
					...options.headers,
			},
			
	});
	const data = await response.json();

	if (response.status !== 201) {
			throw new Error(data.error);
	}

	return data;
}
