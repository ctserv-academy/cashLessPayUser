import { useEffect } from "react";

export function useOutsideClick(ref, onClickOut, isOpen = null) {
    useEffect(() => {

        const onClick = ({ target }) => {
            if (!ref.current)
                return
            if (Array.isArray(ref)) {
                let fnd = ref.find(e => e.current.contains(target))
                if (!fnd) {
                    onClickOut?.()
                }
                else {

                }
            }
            else {
                !ref.current.contains(target) && onClickOut?.()
            }
        }
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
}