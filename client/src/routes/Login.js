import React, { Component } from "react"
import { Grid, TextField } from "@material-ui/core"
import LoginButton from "../components/LoginButton"

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            username: "", 
            password: "",
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.setErrors = this.setErrors.bind(this)
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    setErrors(errors) {
        this.setState({errors})
    }
    render() {

        const width = "20%"

        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '90vh' }}
            >   
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
                        label="Password"
                        margin="normal"
                        variant="standard"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        error={Boolean(this.state.errors.password)}
                        helperText={this.state.errors.password}
                        style={{width}}
                    />
                    <LoginButton state={this.state} setErrors={this.setErrors}/>
            </Grid>
        )
    }
}

