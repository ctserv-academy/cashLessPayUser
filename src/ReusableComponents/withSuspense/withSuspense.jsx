import React, { Suspense } from 'react'
import { Spinner } from '../../reactstrap'

const spinner = <div style={{ display: "grid", placeContent: "center", height: "100%", width: "100%" }}>
    <Spinner />
</div>

export function withSuspense(LazyLoadedComponent) {

    return (props) => {
        return <Suspense fallback={spinner}>
            <LazyLoadedComponent {...props} />
        </Suspense>
    }
}
