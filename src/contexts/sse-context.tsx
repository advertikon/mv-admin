import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { safeJsonParse } from '../utils/common';

type Listener = (message: any) => void;

type KeywordFetchEvent = {
    type: EventType.Keyword;
    keyword: string;
    progress: number;
    finished: boolean;
};

type KeywordFetchError = {
    type: EventType.Keyword;
    error: string;
};

export function isKeywordFetchEvent(event: any): event is KeywordFetchEvent {
    return event?.type === EventType.Keyword;
}

export function isKeywordFetchError(event: any): event is KeywordFetchError {
    return event?.type === EventType.Keyword;
}

enum EventType {
    Keyword = 'keyword',
}

const initContext = {
    onMessage: (() => {}) as Listener,
    offMessage: (() => {}) as Listener,
    onError: (() => {}) as Listener,
    offError: (() => {}) as Listener,
};

export const SseContext = createContext(initContext);

export function SseProvider({ children }) {
    const [, setMessageListeners] = useState<Listener[]>([]);
    const [, setErrorListeners] = useState<Listener[]>([]);
    const evtSource = useRef(null);

    const onMessage = useCallback((listener: Listener) => {
        setMessageListeners(list => [...list, listener]);
    }, []);

    const offMessage = useCallback((listener: Listener) => {
        setMessageListeners(list => list.filter(l => l !== listener));
    }, []);

    const onError = useCallback((listener: Listener) => {
        setErrorListeners(list => [...list, listener]);
    }, []);

    const offError = useCallback((listener: Listener) => {
        setErrorListeners(list => list.filter(l => l !== listener));
    }, []);

    const value = useMemo(
        () => ({ onMessage, offMessage, onError, offError }),
        [onMessage, offMessage, onError, offError]
    );

    const eventHandler = event => {
        const { message, error } = JSON.parse(event.data);

        if (message) {
            setMessageListeners(list =>
                list.map(listener => {
                    listener(safeJsonParse(message) ?? message);
                    return listener;
                })
            );
        } else if (error) {
            setErrorListeners(list =>
                list.map(listener => {
                    listener(safeJsonParse(error) ?? error);
                    return listener;
                })
            );
        }
    };

    useEffect(() => {
        if (!evtSource.current) {
            evtSource.current = new EventSource(`${process.env.NEXT_PUBLIC_SHOPIFY_STATS_HOST}/status`);
            evtSource.current.onmessage = eventHandler;
        }

        return () => {
            evtSource.current.close();
            evtSource.current = null;
        };
    }, []);

    return <SseContext.Provider value={value}>{children}</SseContext.Provider>;
}

export const AuthConsumer = SseContext.Consumer;

export const useAuthContext = () => useContext(SseContext);
