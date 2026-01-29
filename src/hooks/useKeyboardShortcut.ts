import { useEffect } from 'react';

type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean; // Command on Mac
    shiftKey?: boolean;
    altKey?: boolean;
};

export const useKeyboardShortcut = (
    combo: KeyCombo,
    callback: (e: KeyboardEvent) => void,
    deps: any[] = []
) => {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() !== combo.key.toLowerCase()) return;
            if (!!combo.ctrlKey !== event.ctrlKey) return;
            if (!!combo.metaKey !== event.metaKey) return;
            if (!!combo.shiftKey !== event.shiftKey) return;
            if (!!combo.altKey !== event.altKey) return;

            event.preventDefault();
            callback(event);
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [combo, callback, ...deps]);
};
