import { ss } from '@storagestack/core';
import { useState } from 'react';
import { SearchMiddleware } from '@storagestack/search-middleware';

const middleware = new SearchMiddleware('private/diary/', true);
function useSearchMiddleware() {
    const [searchMiddleware, setSearchMiddleware] = useState<SearchMiddleware | null>(null);

    if (!searchMiddleware) {
        console.log('register search middleware');
        ss.useOnce('private/diary/*.json', middleware);
        setSearchMiddleware(middleware);
    }
    return {searchMiddleware};
}

export default useSearchMiddleware;