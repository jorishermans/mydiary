import * as React from 'react';
import { State } from 'webnative';
import { ss, StorageInfo } from '@storagestack/core';
import * as sdk from 'webnative';
import { isAuthSucceeded } from '../auth/useAuth';

export enum PublishingState {
    waiting,
    started,
    finished,
}

export interface Post {
    title: string;
    description: string;
    date: Date;
}

function usePosts(state?: State) {
    const [posts, setPosts] = React.useState<Post[]>([])
    const [fetching, setFetching] = React.useState(false)
    const [publishing, setPublishing] = React.useState<PublishingState>(PublishingState.waiting)

    const fetchPosts = async () => {
        if (isAuthSucceeded(state) && state.fs !== undefined && state.fs.appPath !== undefined) {
            setFetching(true)
            await state.fs.ls(sdk.path.directory('private', 'diary'))
                .then(async baseLinks => {
                    await Promise.all(Object.entries(baseLinks)
                        .filter(v => v[1].isFile)
                        .sort((a, b) =>
                            (b[1].mtime ?? 0) - (a[1].mtime ?? 0)
                        )
                        .map(async ([name, _]) => {
                            // console.log(_.mtime)
                            if (state.fs !== undefined && state.fs.appPath !== undefined) {
                                const fileName = 'private/diary/' + name;
                                if (fileName.indexOf('.json') !== -1) {
                                    await ss.get(fileName)
                                        .then((post: StorageInfo) => setPosts(p => [...p, post.content]))
                                }
                            }
                        })
                    );
                }, console.error);
        }
    }

    const writePost = (name: string, post: Post) => {
        setPublishing(PublishingState.started)
        const fileName = 'private/diary/' + name + '.json';
        const pr = ss.set(fileName, post)
        
        console.log(pr);
        if (pr) {
            pr.then(() => {
                setPublishing(PublishingState.finished)
                setPosts([]);
                fetchPosts().then(() => setFetching(false)).catch(r => console.error(r))
            }, (err) => {
                console.log('could not write', fileName, post);
                console.error(err);
            });
        }
        
    }

    React.useEffect(() => {
            fetchPosts().then(() => setFetching(false)).catch(r => console.error(r))
        }
        ,
        [state]
    )

    React.useEffect(() => {
        if (publishing.valueOf() === PublishingState.finished.valueOf()) {
            setTimeout(() => {
                setPublishing(PublishingState.waiting)
            }, 5000)
        }
    }, [publishing])

    React.useEffect(() =>
            console.log(
                `fetching: ${fetching}`,
                `publishing: ${publishing}`
            ),
        [fetching, publishing]
    )

    return {posts, writePost, publishing, setPublishing, fetching}
}

export default usePosts;