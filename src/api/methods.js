const buildUrl = (url, params = {}) => {
    const requestUrl = new URL(url);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            requestUrl.searchParams.set(key, value);
        }
    });

    return requestUrl.toString();
};

export async function get(url, params = {}, options = {}) {
    try {
        const response = await fetch(buildUrl(url, params), {
            method: 'GET',
            ...options
        });
        const data = await response.json().catch(() => null);

        if (response.ok) {
            return { status: response.status, data };
        }

        return {
            status: response.status,
            error: data || 'Unexpected status code'
        };
    } catch (err) {
        return { status: 'network_error', error: err.message };
    }
}
