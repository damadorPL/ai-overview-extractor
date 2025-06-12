class AutomationStateMachine {
    constructor() {
        this.state = 'IDLE';
        this.previousState = null;
        this.stateData = {};
        this.stateChangeCallbacks = [];
        
        // Definicja dozwolonych przejść między stanami
        this.states = {
            IDLE: ['START_AUTOMATION', 'MANUAL_MODE'],
            EXPANDING_OVERVIEW: ['OVERVIEW_COMPLETE', 'OVERVIEW_FAILED', 'OVERVIEW_SKIPPED'],
            EXPANDING_SOURCES: ['SOURCES_COMPLETE', 'SOURCES_FAILED', 'SOURCES_SKIPPED'],
            SENDING_WEBHOOK: ['WEBHOOK_COMPLETE', 'WEBHOOK_FAILED', 'WEBHOOK_SKIPPED'],
            COMPLETED: ['RESET'],
            FAILED: ['RETRY', 'FALLBACK_TO_MANUAL', 'RESET'],
            MANUAL_MODE: ['RESET'],
            RETRYING: ['START_AUTOMATION', 'FALLBACK_TO_MANUAL']
        };
        
        console.log('[AutomationStateMachine] Initialized in state:', this.state);
    }

    // Rejestruje callback wywoływany przy zmianie stanu
    onStateChange(callback) {
        this.stateChangeCallbacks.push(callback);
    }

    // Próbuje przejść do nowego stanu
    transition(action, data = null) {
        const allowedActions = this.states[this.state] || [];
        
        if (!allowedActions.includes(action)) {
            console.warn(`[AutomationStateMachine] Invalid transition: ${this.state} -> ${action}`);
            return false;
        }
        
        this.previousState = this.state;
        this.state = this.getNextState(action);
        this.stateData = { ...this.stateData, ...data };
        
        console.log(`[AutomationStateMachine] ${this.previousState} -> ${this.state} (${action})`);
        
        // Wywołaj callbacki
        this.stateChangeCallbacks.forEach(callback => {
            try {
                callback(this.state, this.previousState, action, data);
            } catch (error) {
                console.error('[AutomationStateMachine] Error in state change callback:', error);
            }
        });
        
        return true;
    }

    // Mapuje akcję na następny stan
    getNextState(action) {
        const stateMap = {
            'START_AUTOMATION': 'EXPANDING_OVERVIEW',
            'OVERVIEW_COMPLETE': 'EXPANDING_SOURCES',
            'OVERVIEW_FAILED': 'FAILED',
            'OVERVIEW_SKIPPED': 'EXPANDING_SOURCES',
            'SOURCES_COMPLETE': 'SENDING_WEBHOOK',
            'SOURCES_FAILED': 'FAILED',
            'SOURCES_SKIPPED': 'SENDING_WEBHOOK',
            'WEBHOOK_COMPLETE': 'COMPLETED',
            'WEBHOOK_FAILED': 'FAILED',
            'WEBHOOK_SKIPPED': 'COMPLETED',
            'RETRY': 'RETRYING',
            'FALLBACK_TO_MANUAL': 'MANUAL_MODE',
            'MANUAL_MODE': 'MANUAL_MODE',
            'RESET': 'IDLE'
        };
        
        return stateMap[action] || this.state;
    }

    // Sprawdza czy można wykonać daną akcję
    canExecute(action) {
        const allowedActions = this.states[this.state] || [];
        return allowedActions.includes(action);
    }

    // Resetuje stan maszyny
    reset() {
        const oldState = this.state;
        this.state = 'IDLE';
        this.previousState = null;
        this.stateData = {};
        
        console.log(`[AutomationStateMachine] Reset: ${oldState} -> ${this.state}`);
        
        // Wywołaj callbacki
        this.stateChangeCallbacks.forEach(callback => {
            try {
                callback(this.state, oldState, 'RESET', null);
            } catch (error) {
                console.error('[AutomationStateMachine] Error in reset callback:', error);
            }
        });
    }

    // Pobiera aktualny stan
    getCurrentState() {
        return this.state;
    }

    // Sprawdza czy automatyzacja jest w toku
    isAutomationActive() {
        return ['EXPANDING_OVERVIEW', 'EXPANDING_SOURCES', 'SENDING_WEBHOOK'].includes(this.state);
    }

    // Sprawdza czy automatyzacja została zakończona
    isCompleted() {
        return this.state === 'COMPLETED';
    }

    // Sprawdza czy wystąpił błąd
    isFailed() {
        return this.state === 'FAILED';
    }

    // Sprawdza czy jest w trybie manualnym
    isManualMode() {
        return this.state === 'MANUAL_MODE';
    }

    // Pobiera dane stanu
    getStateData() {
        return { ...this.stateData };
    }

    // Aktualizuje dane stanu
    updateStateData(data) {
        this.stateData = { ...this.stateData, ...data };
    }

    // Pobiera historię ostatniego przejścia
    getLastTransition() {
        return {
            from: this.previousState,
            to: this.state,
            data: this.stateData
        };
    }
}

// Eksportuj klasę dla innych modułów
window.AutomationStateMachine = AutomationStateMachine;
