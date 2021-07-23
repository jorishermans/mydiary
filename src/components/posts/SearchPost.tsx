import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

import IconButton from '@material-ui/core/IconButton';
import { Container } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

interface ISearchPostProps {
    onSearch: (name: string) => void
}

const SearchPost: React.FC<ISearchPostProps> = ({onSearch}) => {
    const classes = useStyles();

    const [searchValue, setSearchValue] = React.useState<string>()
    const submit = () => {
        console.log('before submit', searchValue);
        if (searchValue) {
            onSearch(searchValue);
        }
    }

  return (
    <Container component="main" maxWidth="xs">
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search post"
        inputProps={{ 'aria-label': 'search post' }}
        onChange={e => setSearchValue(e.target.value)}
      />
      <IconButton className={classes.iconButton} onClick={submit} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
    </Container>
  );
}

export default SearchPost;