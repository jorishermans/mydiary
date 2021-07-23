import { Box, CircularProgress, createMuiTheme, createTheme, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { ss, StorageInfo } from '@storagestack/core';
import { Score } from '@texthill/core';
import * as React from 'react';
import * as sdk from 'webnative';
import AddPost from '../posts/AddPost';
import SearchPost from '../posts/SearchPost';
import ShowPosts from '../posts/ShowPosts';
import usePosts, { Post } from '../posts/usePosts';
import LoginForm from './LoginForm';
import useAuth from './useAuth';
import useMiddleware from './useMiddleware';
import useSearchMiddleware from './useSearchMiddleware';
import useWebNativeProvider from './useWebNativeProvider';

const AuthLayout: React.FC<{}> = () => {
    const {state} = useAuth();
    // const {addPhotos, photos, publishing, fetching} = usePhotos(state);
    const {posts, writePost, publishing, setPublishing, fetching} = usePosts(state);
    const {wnProvider} = useWebNativeProvider(state);
    const {searchMiddleware} = useSearchMiddleware();

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const [searchable, setSearchable] = React.useState<boolean>(false);
    const [searchValue, setSearchValue] = React.useState<string | null>();
    const [searchResults, setSearchResults] = React.useState<Post[]>([]);
    const searching = (sv: string) => {
        console.log(sv);
        setSearchResults([]);
        setSearchValue(null);
        searchMiddleware?.search(sv).then((scores) => {
            console.log(scores);
            setScoresIntoResults(sv, scores);
        })
    }

    const setScoresIntoResults = async (sv: string, scores: Score[]) => {
        await scores.forEach(async s => {
            await ss.get(s.name).then((post: StorageInfo) => setSearchResults(p => [...p, post.content]));
        })

        setSearchValue(sv);
    }

    const theme = createTheme({
        palette: {
            type: prefersDarkScheme.matches ? 'dark' : 'light',
            background: {
                default: prefersDarkScheme.matches ? '#222' : '#fafafa'
            }
        }
    });

    const useStyles = makeStyles(theme => ({
        '@global': {
            '@keyframes fadeIn': {
                from: {opacity: 0},
                to: {opacity: 1},
            },
        },
        box: {
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        layout: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        loading: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: 50,
        },
        progress: {
            // opacity: publishing.valueOf() === PublishingState.started.valueOf() ? 1 : 0,
            animation: `$fadeIn .325s ${theme.transitions.easing.easeInOut}`,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
        },
        successAlert: {
            ...theme.typography.body1,
            backgroundColor: theme.palette.success.main,
            borderColor: theme.palette.success.main,
            color: theme.palette.common.white,
            display: 'flex',
            paddingTop: theme.spacing(),
            paddingBottom: theme.spacing(),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            borderRadius: 4,
            letterSpacing: '0.01071em',
        }
    }))

    const classes = useStyles();

    const loading = <Box className={classes.loading}>
        <CircularProgress />
    </Box>
    switch (state?.scenario) {
        case sdk.Scenario.AuthSucceeded:
        case sdk.Scenario.Continuation:
            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <a onClick={() => setSearchable(true)}>Search</a> | <a onClick={() => setSearchable(false)}>Posts</a>
                    { searchable ? 
                    <div><h2>Search</h2>
                        <SearchPost onSearch={searching}></SearchPost>
                        {searchResults.length == 0 && searchValue && (
                            <div>Nothing found for {searchValue}</div>
                        )}
                        {searchResults.length > 0 && searchValue && (
                            <ShowPosts posts={searchResults}></ShowPosts>
                        )}
                    </div>
                    : 
                    <div><AddPost writePost={writePost}></AddPost>
                        {fetching && loading}
                        {posts.length > 0 && (
                            <ShowPosts posts={posts}></ShowPosts>
                        )}
                    </div>
                    }
                    
                </ThemeProvider>  
            );
        case sdk.Scenario.NotAuthorised:
            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <LoginForm/>
                </ThemeProvider>
            );
        default:
            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {loading}
                </ThemeProvider>
            )
}

};

export default AuthLayout;