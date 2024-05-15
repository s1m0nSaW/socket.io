class RequestManager {
    constructor() {
        this.activeRequests = new Map();
    }

    has(requestId) {
        return this.activeRequests.has(requestId);
    }

    set(requestId, value) {
        this.activeRequests.set(requestId, value);
    }

    delete(requestId) {
        this.activeRequests.delete(requestId);
    }

    clear() {
        this.activeRequests.clear();
    }
}

const requestManager = new RequestManager();

export default requestManager;