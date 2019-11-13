import React, { Component } from "react"
import { Grid, Button, Snackbar, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { useParams, useHistory } from "react-router-dom"
import axios from "../utils/axios"
import Post from "../components/Post"
import UserList from "../components/UserList"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import Snack from "../components/Snack"
import CircularProgress from "@material-ui/core/CircularProgress" 
import PersonAddIcon from "@material-ui/icons/PersonAdd"

class UserInfo extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            username: "", 
            posts: [], 
            followers: [], 
            following: [],
            message: "",
            loading: {
                page: false,
                follow: false
            }
        }
        this.handleFollow = this.handleFollow.bind(this)
    }
    componentDidMount() {
        this.setState({ ...this.state, loading: { ...this.state.loading, page: true}})
        axios.get(`/api/users/${this.props.username}`)
        .then(res => {
            this.setState(res.data)
            axios.get(`/api/users/${this.props.username}/posts`)
                 .then(res => this.setState({posts: res.data}))
                 .catch(err => this.setState(err.response))
                 .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, page: false}}))
        })
        .catch(err => this.props.redirect(err))
    }
    handleFollow(event) {
        this.setState({ ...this.state, loading: { ...this.state.loading, follow: true}})
        axios.post(`/api/users/${this.props.username}/follow`)
             .then(res => {
                this.setState({message: res.data.message})
                this.props.setOpen(true);
             })
             .catch(err => this.setState(err.response))
             .finally(() => this.setState({ ...this.state, loading: { ...this.state.loading, follow: false}}))
       
    }
    render() {

        const followText = this.state.loading.follow ? <CircularProgress size="1.5rem" style={{color: "#FFF"}}/>  : "Follow"

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
            (<Grid container>
                <Grid container item xs={12} spacing={4}>

                    <Grid item xs={4}>

                        <UserList data={this.state.followers} name={"Followers"}/>

                    </Grid>

                    <Grid item xs={4}>

                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={this.state.username} secondary={this.state.status}/>
                        </ListItem> 

                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={this.handleFollow}
                            endIcon={this.state.loading.follow ? <></> : <PersonAddIcon />}
                            fullWidth
                        >
                            {followText}
                        </Button>

                        {this.state.posts.map((post, i) => <Post data={post} key={i}/>)}

                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={this.props.open}
                            autoHideDuration={6000}
                            message={<span id="message-id">{this.state.message}</span>}
                            style={{width: "min-content"}}
                        />

                    </Grid>

                    <Grid item xs={4}>
                    
                        <UserList data={this.state.following} name={"Following"}/>

                    </Grid>

                    <Snack open={this.props.open} setOpen={this.props.setOpen} message={this.state.message}/>

                </Grid>
            </Grid>
        )
    }
}

export default function User() {

    let { username } = useParams();
    const [open, setOpen] = React.useState(false);
    let history = useHistory();

    function redirect(err) {

        if(err.response && err.response.request.responseURL) history.push("/")
        
    }
    
    return (
        <UserInfo redirect={redirect} username={username} open={open} setOpen={setOpen}/>
    )
}
