const fetchWithRefresh = async (url, options = {}) => {
    // Make the initial request
    let response = await fetch(url, {
        ...options,
        credentials: 'include'
    });

    if (response.status !== 401) {
        return response;
    }

    // Token expired, try to refresh
    try {
        const refreshResponse = await fetch('/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!refreshResponse.ok) {
            // Refresh failed, redirect to login
            window.location.href = '/login';
            return response;
        }

        // Refresh succeeded, retry original request
        response = await fetch(url, {
            ...options,
            credentials: 'include'
        });

        return response;
    } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh throws, redirect to login
        window.location.href = '/login';
        return response;
    }
};

/**
 * Helper to handle fetch responses and throw on non-2xx
 */
const handleFetchResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        const message = data?.message || data?.errors?.[0]?.msg || 'Request failed';
        throw new Error(message);
    }

    return data;
};
