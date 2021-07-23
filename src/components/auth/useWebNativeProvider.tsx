import { ss } from '@storagestack/core';
import { WebNativeProvider } from '@storagestack/webnative-provider';
import { useState } from 'react';
import { State } from 'webnative';

function useWebNativeProvider(state: State | undefined) {
    const [wnProvider, setWnProvider] = useState<WebNativeProvider | null>(null);

    if (state && !wnProvider) {
        const provider = new WebNativeProvider(state, true);
        ss.registerProvider(provider, '**');
        setWnProvider(provider);
    }
    return {wnProvider};
}

export default useWebNativeProvider;