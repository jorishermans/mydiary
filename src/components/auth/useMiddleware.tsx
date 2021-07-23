import { ss } from '@storagestack/core';
import { useState } from 'react';
import { JsonMiddleware } from '@storagestack/json-middleware';
import { LoggingMiddleware } from '@storagestack/logging-middleware';

const middleware = new JsonMiddleware();
function useMiddleware() {
    const [jsonMiddleware, setJsonMiddleware] = useState<JsonMiddleware | null>(null);

    if (!jsonMiddleware) {
        ss.setDebugging(true);
        
        const findMiddleware = ss.findMiddlewareByType(middleware);
        if (!findMiddleware) {
            console.log('register json middleware');
            ss.use('**', middleware);
            ss.use('**', new LoggingMiddleware());
            setJsonMiddleware(middleware);
        } else {
            setJsonMiddleware(findMiddleware);
        }
    }
    return {jsonMiddleware};
}

export default useMiddleware;