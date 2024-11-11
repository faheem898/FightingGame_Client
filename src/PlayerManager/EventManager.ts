export default class EventManager {
    private static dispatcher: EventTarget | null = null;

    static clear() {
        EventManager.dispatcher = null;
    }

    static getDispatcher(): EventTarget {
        if (!EventManager.dispatcher) {
            EventManager.dispatcher = new EventTarget();
        }
        return EventManager.dispatcher;
    }

    static fire(eventType: string, userData: any = null, bubbles: boolean = true): void {
        const dispatcher = EventManager.getDispatcher();
        const event = new CustomEvent(eventType, {
            bubbles,
            detail: userData,
        });
        dispatcher.dispatchEvent(event);
    }

    static addEventListener(
        eventType: string,
        callback: (event: CustomEvent<any>) => void
    ): void {
        const wrappedCallback = (event: Event) => callback(event as CustomEvent);
        EventManager.getDispatcher().addEventListener(eventType, wrappedCallback as EventListener);
    }

    static removeEventListener(
        eventType: string,
        callback: (event: CustomEvent<any>) => void
    ): void {
        const wrappedCallback = (event: Event) => callback(event as CustomEvent);
        EventManager.getDispatcher().removeEventListener(eventType, wrappedCallback as EventListener);
    }

    // Optional .on and .off aliases
    static on = EventManager.addEventListener;
    static off = EventManager.removeEventListener;
}
