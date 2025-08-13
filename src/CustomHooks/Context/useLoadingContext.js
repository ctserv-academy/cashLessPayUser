import { useContext } from 'react'
import { LoadingContext } from '../../ContextProvider/LoadingContext';

export function useLoadingContext() {

    const { isLoading, setisLoading } = useContext(LoadingContext);
    return [isLoading, setisLoading];
}
