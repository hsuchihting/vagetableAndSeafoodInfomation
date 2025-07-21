export async function get(url, options = {}) {
    try {
        const response = await fetch(url, { method: 'GET', ...options });
        if (response.status === 200) {
            const data = await response.json();
            return { status: 200, data };
        } else if (response.status === 400) {
            const error = await response.json();
            return { status: 400, error };
        } else {
            return { status: response.status, error: 'Unexpected status code' };
        }
    } catch (err) {
        return { status: 'network_error', error: err.message };
    }
}