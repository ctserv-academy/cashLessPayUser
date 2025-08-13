// Source - https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743

import { useContext, useEffect, useCallback, useRef } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker, when = true) {
    const { navigator } = useContext(NavigationContext);
    const CounterRef = useRef(Math.random())

    const location = navigator.location.pathname;



    useEffect(() => {
        if (!when) return;

        const unblock = navigator.block((tx) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                }
            };

            blocker(autoUnblockingTx, CounterRef);
        });

        return unblock;
    }, [when]);
}

export default function usePrompt(message, when = true) {
    const blocker = useCallback(
        (tx, CounterRef) => {

            if (CounterRef.current === 0) {
                if (window.confirm(message)) {
                    CounterRef.current += 1
                    tx.retry(); //retry to navigate
                }
            }
            else {
                tx.retry(); //retry to navigate
            }
            CounterRef.current += 1

        },
        [message]
    );

    useBlocker(blocker, when);
}
