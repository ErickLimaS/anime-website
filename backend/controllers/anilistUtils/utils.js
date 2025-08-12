function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleError({ error, res }) {
    return res.status(error.errors[0].status || 500).json({
        message: error.errors[0].message || "An error occurred",
        error: error.errors || "An error occurred",
        result: null
    });
}

module.exports = {
    handleResponse,
    handleData,
    handleError
} 