import { Button, Container, Grid, makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { Post } from "./usePosts";
import { generateUID } from "./uuid";

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  
interface IAddPostProps {
    writePost: (name: string, post: Post) => void
}
const AddPost: React.FC<IAddPostProps> = ({writePost}) => {
    const classes = useStyles();

    const [title, setTitle] = React.useState<string>()
    const [description, setDescription] = React.useState<string>()
    const submit = () => {
        console.log('before submit', title, description);
        if (title && description) {
            writePost(generateUID(), {title, description, date: new Date()});
        }
    }

    return (
        <Container component="main" maxWidth="xs">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="fname"
                            name="title"
                            variant="outlined"
                            required
                            fullWidth
                            id="title"
                            label="Title"
                            autoFocus
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            id="post"
                            label="Post"
                            name="post"
                            autoComplete="lname"
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={submit}
                >
                    Post
                </Button>
        </Container>
    )
}

export default AddPost;
