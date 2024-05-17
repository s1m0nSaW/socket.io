class RequestManager {
    constructor() {
        this.activeRequests = new Map();
    }

    has(userId) {
        return this.activeRequests.has(userId);
    }

    set(userId, requestId) {
        this.activeRequests.set(userId, requestId);
    }

    delete(userId) {
        this.activeRequests.delete(userId);
    }

    clear() {
        this.activeRequests.clear();
    }
}

const requestManager = new RequestManager();

export default requestManager;