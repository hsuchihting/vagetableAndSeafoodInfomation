export function get(url, options = {}) {
    return new Promise((resolve) => {
        fetch(url, { method: 'GET', ...options })
            .then(response => {
                if (response.status === 200) {
                    return response.json().then(data => {
                        resolve({ status: 200, data });
                    });
                } else if (response.status === 400) {
                    return response.json().then(error => {
                        resolve({ status: 400, error });
                    });
                } else {
                    resolve({ status: response.status, error: 'Unexpected status code' });
                }
            })
            .catch(err => {
                resolve({ status: 'network_error', error: err.message });
            });
    });
}