import React, { Component } from "react"
import { Grid, Button, TextField, ListItem, ListItemIcon, ListItemText, List  } from "@material-ui/core"
import axios from "../utils/axios"
import { Link } from "react-router-dom"

import HomeMenu from "../components/HomeMenu"
import LogoutButton from "../components/LogoutButton"
import Post from "../components/Post"
import UserList from "../components/UserList"
import Snack from "../components/Snack"

import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import CircularProgress from "@material-ui/core/CircularProgress"
import SearchIcon from "@material-ui/icons/Search"
import UpdateIcon from "@material-ui/icons/Update" 

class HomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                username: "",
                status: "",
                posts: [],
                following: [],
                followers: []
            },
            loading: { page: false, tweet: false, update: false, search: false },
            text: "", status: "", searchUsername: "", searchStatus: "", message: "",
            users: [], posts: [],
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.createPost = this.createPost.bind(this)
        this.removePost = this.removePost.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }
    componentDidMount() {
        this.setState({ ...this.state, loading: { ...this.state.loading, page: true}})
        axios.get(`/api/users/auth`)
             .then(res => this.setState({user: res.data.user, posts: res.data.posts}))
             .catch(err => this.setState(err.response))
             .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, page: false}}))
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    createPost() {

        if(this.state.text.length === 0) {
            this.setState({errors: {text: "Text cannot be empty"}})
            return
        }

        this.setState({ ...this.state, loading: { ...this.state.loading, tweet: true}})
        
        axios.post(`/api/posts`, {text: this.state.text})
             .then(res => {
                 this.setState({ message: "Post created", posts: [...this.state.posts, res.data]})
                 this.props.setOpen(true);
             })
             .catch(err => this.setState(err.response.data))
             .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, tweet: false}}))

    }
    removePost(id) {
        
        axios.delete(`/api/posts/${id}`)
             .then(res => {
                 this.setState({message: "Post deleted", posts: [...this.state.posts].filter(post => post._id !== res.data.post._id)})
                 this.props.setOpen(true);
             })
             .catch(err => this.setState({errors: err.response.data}))

    }
    updateStatus(event) {

        this.setState({ ...this.state, loading: { ...this.state.loading, status: true}})
        axios.put(`/api/users`, { status: this.state.status })
             .then(res => {
                 this.setState({message: "Status updated", user: {...this.state.user, status: this.state.status}})
                 this.props.setOpen(true);
             })
             .catch(err => this.setState(err.response.data))
             .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, status: false}}))
    }
    handleSearch() {

        this.setState({ ...this.state, loading: { ...this.state.loading, search: true}})
        const query = {
            username: this.state.searchUsername,
            status: this.state.searchStatus
        }
      
        axios.get("/api/users", { params: query })
             .then(res => this.setState({users: res.data}))
             .catch(err => this.setState(err))
             .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, search: false}}))
    }
    render() {

        const width = "100%"
        const jwt = localStorage.getItem("jwt");
    
        if (!jwt) return <HomeMenu />;

        const tweetText = this.state.loading.tweet ? <CircularProgress size="1.5rem" style={{color: "#FFF"}}/>  : "Tweet"
        const statusText = this.state.loading.status ? <CircularProgress size="1.5rem" style={{color: "#FFF"}}/>  : "Update"
        const searchText = this.state.loading.search ? <CircularProgress size="1.5rem" style={{color: "#FFF"}}/>  : "Search"

        return this.state.loading.page ? 
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '90vh' }}
            >  
                <CircularProgress size="10rem" color="primary"/>
            </Grid> 
            : 
            ( <Grid container>
                <Grid container item xs={12} spacing={10}>
                    <Grid item xs={4}>

                        <UserList data={this.state.user.followers} name={"Followers"}/>

                        <UserList data={this.state.user.following} name={"Following"}/>

                    </Grid>

                    <Grid item xs={4}>

                        <TextField
                            label="What's happening?"
                            multiline
                            margin="normal"
                            name="text"
                            value={this.state.text}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.text)}
                            helperText={this.state.errors.text}
                            style={{width}}
                        />
                        <Button variant="contained" color="primary" onClick={this.createPost} fullWidth>
                            {tweetText}
                        </Button>

                        <List >
                            {this.state.posts.map((post, i) => 
                                <Post 
                                    key={i} 
                                    user={this.state.user.username}
                                    remove={(id) => this.removePost(id)}
                                    data={post}/>
                                )}
                        </List>
                    </Grid>

                    <Grid item xs={4}>

                        <ListItem>
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={this.state.user.username} secondary={this.state.user.status}/>
                        </ListItem> 


                        <TextField
                            label="Update status"
                            multiline
                            margin="normal"
                            name="status"
                            value={this.state.status}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.status)}
                            helperText={this.state.errors.status}
                            style={{width}}
                        />

                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={this.updateStatus}
                            endIcon={this.state.loading.status ? <></> : <UpdateIcon />}
                            fullWidth
                        >
                            {statusText}
                        </Button>

                        <br />
                        <br />

                        <LogoutButton />

                        <TextField
                            label="Search by username"
                            margin="normal"
                            variant="standard"
                            type="text"
                            name="searchUsername"
                            value={this.state.searchUsername}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.searchUsername)}
                            helperText={this.state.errors.searchUsername}
                            style={{width}}
                        />
                        <TextField
                            label="Search by status"
                            margin="normal"
                            variant="standard"
                            type="text"
                            name="searchStatus"
                            value={this.state.searchStatus}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.searchUsername)}
                            helperText={this.state.errors.searchStatus}
                            style={{width}}
                        />

                        <Button 
                            variant="contained" 
                            color="primary"
                            endIcon={this.state.loading.search ? <></> : <SearchIcon />} 
                            onClick={this.handleSearch}
                            fullWidth
                        >
                            {searchText}
                        </Button>

                        <List component="nav">
                            {this.state.users.map((user, i) => 
                                <Link key={i} to={`/users/${user.username}`} >
                                    <ListItem button color="primary">
                                        <ListItemIcon>
                                            <AccountCircleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={user.username} secondary={user.status}/>
                                    </ListItem>
                                </Link>
                            )}
                        </List>

                    </Grid>

                    <Snack open={this.props.open} setOpen={this.props.setOpen} message={this.state.message}/>

                </Grid>

            </Grid>
        )
    }
}

export default function Home() {

    const [open, setOpen] = React.useState(false);
    
    return (
        <HomeComponent open={open} setOpen={setOpen}/>
    )
}
