

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>;
}

export default async function apiFetch(endpoint: string, options: FetchOptions = {}) {

	const defaultHeaders = {
			"Content-Type": "application/json",
	};

	const response = await fetch(`${import.meta.env.PUBLIC_API_URL}${endpoint}`, {
			...options,
			headers: {
					...defaultHeaders,
					...options.headers,
			},
			credentials: 'include'
			
	});
	const data = await response.json();

	if (!response.ok) {
			throw new Error(data.error);
	}

	return data;
}
