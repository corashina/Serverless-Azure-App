import React, { Component } from "react"
import { Grid, TextField, Button, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { Link } from "react-router-dom"
import axios from "../utils/axios"
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            username: "", 
            status: "",
            users: [],
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit(event){

        const query = {
            username: this.state.username,
            status: this.state.status
        }
      
        axios.get("/api/users", { params: query })
             .then(res => this.setState({users: res.data}))
             .catch(err => this.setState(err))
    }
    render() {

        const width = "100%"

        return (
            <Grid container>
                <Grid container item xs={12} spacing={4}>

                    <Grid item xs={4}/>
                  
                    <Grid item xs={4}>

                        <Link to={`/`} >
                            <Button variant="contained" color="primary" fullWidth>
                                Home
                            </Button>
                        </Link>

                        <TextField
                            label="Username"
                            margin="normal"
                            variant="standard"
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.username)}
                            helperText={this.state.errors.username}
                            style={{width}}
                        />
                        <TextField
                            label="Status"
                            margin="normal"
                            variant="standard"
                            type="text"
                            name="status"
                            value={this.state.status}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errors.status)}
                            helperText={this.state.errors.status}
                            style={{width}}
                        />
                        <Button variant="contained" color="primary" onClick={this.handleSubmit} fullWidth>
                            Search
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

                    <Grid item xs={4} />
                    
                </Grid>
            </Grid>
        )
    }
}