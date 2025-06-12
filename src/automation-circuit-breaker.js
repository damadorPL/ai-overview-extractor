class AutomationCircuitBreaker {
    constructor(moduleName, options = {}) {
        this.moduleName = moduleName;
        this.failures = 0;
        this.maxFailures = options.maxFailures || 3;
        this.resetTimeout = options.resetTimeout || 60000; // 1 minute
        this.retryDelay = options.retryDelay || 2000; // 2 seconds
        this.lastFailureTime = 0;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.successCount = 0;
        this.halfOpenSuccessThreshold = options.halfOpenSuccessThreshold || 1;
        
        console.log(`[CircuitBreaker:${this.moduleName}] Initialized with maxFailures: ${this.maxFailures}, resetTimeout: ${this.resetTimeout}ms`);
    }

    // Wykonuje operację z zabezpieczeniem circuit breaker
    async execute(operation, operationName = 'unknown') {
        console.log(`[CircuitBreaker:${this.moduleName}] Executing ${operationName} in state: ${this.state}`);
        
        // Sprawdź czy circuit breaker powinien przejść do HALF_OPEN
        if (this.state === 'OPEN' && this.shouldTryReset()) {
            this.state = 'HALF_OPEN';
            console.log(`[CircuitBreaker:${this.moduleName}] Transitioning to HALF_OPEN state`);
        }
        
        // Jeśli circuit breaker jest OPEN, odrzuć operację
        if (this.state === 'OPEN') {
            console.log(`[CircuitBreaker:${this.moduleName}] Circuit breaker OPEN - rejecting ${operationName}`);
            throw new Error(`Circuit breaker OPEN for ${this.moduleName}`);
        }
        
        try {
            // Wykonaj operację
            const startTime = Date.now();
            const result = await operation();
            const duration = Date.now() - startTime;
            
            console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} completed in ${duration}ms, result:`, result);
            
            // Sprawdź czy operacja się powiodła
            if (result === true || (typeof result === 'object' && result.success === true)) {
                this.onSuccess();
                return result;
            } else {
                this.onFailure(`Operation returned: ${result}`);
                return result;
            }
        } catch (error) {
            console.error(`[CircuitBreaker:${this.moduleName}] ${operationName} failed:`, error);
            this.onFailure(error.message);
            throw error;
        }
    }

    // Wykonuje operację z automatycznym retry
    async executeWithRetry(operation, operationName = 'unknown', maxRetries = 2) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
            try {
                console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} attempt ${attempt}/${maxRetries + 1}`);
                
                const result = await this.execute(operation, operationName);
                
                if (result === true || (typeof result === 'object' && result.success === true)) {
                    console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} succeeded on attempt ${attempt}`);
                    return result;
                }
                
                // Jeśli wynik to false, traktuj jako błąd softowy
                if (attempt <= maxRetries) {
                    console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} returned false, retrying in ${this.retryDelay}ms...`);
                    await this.delay(this.retryDelay);
                    continue;
                }
                
                return result;
            } catch (error) {
                lastError = error;
                
                // Jeśli circuit breaker jest OPEN, nie próbuj ponownie
                if (this.state === 'OPEN') {
                    console.log(`[CircuitBreaker:${this.moduleName}] Circuit breaker OPEN - stopping retries`);
                    throw error;
                }
                
                // Jeśli to nie ostatnia próba, czekaj przed ponowną próbą
                if (attempt <= maxRetries) {
                    console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} failed, retrying in ${this.retryDelay}ms... (${maxRetries + 1 - attempt} attempts left)`);
                    await this.delay(this.retryDelay);
                } else {
                    console.log(`[CircuitBreaker:${this.moduleName}] ${operationName} failed after ${attempt} attempts`);
                    throw error;
                }
            }
        }
        
        throw lastError;
    }

    // Wywoływane przy sukcesie operacji
    onSuccess() {
        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            console.log(`[CircuitBreaker:${this.moduleName}] Success in HALF_OPEN state (${this.successCount}/${this.halfOpenSuccessThreshold})`);
            
            if (this.successCount >= this.halfOpenSuccessThreshold) {
                this.state = 'CLOSED';
                this.failures = 0;
                this.successCount = 0;
                console.log(`[CircuitBreaker:${this.moduleName}] Transitioning to CLOSED state - circuit breaker reset`);
            }
        } else if (this.state === 'CLOSED') {
            // Reset failure count on success in CLOSED state
            if (this.failures > 0) {
                console.log(`[CircuitBreaker:${this.moduleName}] Success in CLOSED state - resetting failure count from ${this.failures} to 0`);
                this.failures = 0;
            }
        }
    }

    // Wywoływane przy błędzie operacji
    onFailure(reason = 'unknown') {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        console.log(`[CircuitBreaker:${this.moduleName}] Failure ${this.failures}/${this.maxFailures}: ${reason}`);
        
        if (this.failures >= this.maxFailures) {
            this.state = 'OPEN';
            this.successCount = 0;
            console.log(`[CircuitBreaker:${this.moduleName}] Transitioning to OPEN state - circuit breaker opened`);
        }
    }

    // Sprawdza czy powinien próbować reset (OPEN -> HALF_OPEN)
    shouldTryReset() {
        const timeSinceLastFailure = Date.now() - this.lastFailureTime;
        const shouldReset = timeSinceLastFailure >= this.resetTimeout;
        
        if (shouldReset) {
            console.log(`[CircuitBreaker:${this.moduleName}] ${timeSinceLastFailure}ms elapsed since last failure - ready for reset`);
        }
        
        return shouldReset;
    }

    // Pomocnicza funkcja opóźnienia
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Pobiera aktualny stan circuit breaker
    getState() {
        return {
            state: this.state,
            failures: this.failures,
            maxFailures: this.maxFailures,
            lastFailureTime: this.lastFailureTime,
            successCount: this.successCount,
            timeSinceLastFailure: Date.now() - this.lastFailureTime
        };
    }

    // Resetuje circuit breaker manualnie
    reset() {
        const oldState = this.state;
        this.state = 'CLOSED';
        this.failures = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        
        console.log(`[CircuitBreaker:${this.moduleName}] Manual reset: ${oldState} -> ${this.state}`);
    }

    // Sprawdza czy circuit breaker jest dostępny
    isAvailable() {
        return this.state !== 'OPEN' || this.shouldTryReset();
    }

    // Pobiera metryki circuit breaker
    getMetrics() {
        return {
            moduleName: this.moduleName,
            state: this.state,
            failures: this.failures,
            maxFailures: this.maxFailures,
            successCount: this.successCount,
            lastFailureTime: this.lastFailureTime,
            timeSinceLastFailure: this.lastFailureTime ? Date.now() - this.lastFailureTime : 0,
            isAvailable: this.isAvailable()
        };
    }
}

// Eksportuj klasę dla innych modułów
window.AutomationCircuitBreaker = AutomationCircuitBreaker;
