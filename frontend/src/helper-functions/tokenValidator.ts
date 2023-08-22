
	type TokenData = {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number; 
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const tokenData = getTokenData();

    if (!tokenData) {
        throw new Error("No tokens available. Please redirect to login.");
    }

    if (isTokenExpired(tokenData)) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
            throw new Error("Failed to refresh token or refresh token expired. Please redirect to login.");
        }
    }

    const updatedToken = getTokenData();  
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${updatedToken?.accessToken}`
    };

    return fetch(`${import.meta.env.PUBLIC_API_URL}${endpoint}`, options);
}

function getTokenData(): TokenData | null {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");
    const expiresAt = Number(localStorage.getItem("expiresAt"));

    if (!accessToken || !refreshToken || !expiresAt) {
        return null;
    }

    return { accessToken, refreshToken, expiresAt };
}

function isTokenExpired(tokenData: TokenData): boolean {
    const now = Date.now();
    return now >= tokenData.expiresAt!;
}

async function tryRefreshToken(): Promise<boolean> {
    const tokenData = getTokenData();

    if (!tokenData || isTokenExpired(tokenData)) {
        return false;
    }

    const response = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.refreshToken}`
        }
    });

    if (!response.ok) {
        return false;
    }

    const newTokenData: TokenData = await response.json();

    localStorage.setItem("accessToken", newTokenData.accessToken!);
    localStorage.setItem("expiresAt", String(newTokenData.expiresAt));

    return true;
}

