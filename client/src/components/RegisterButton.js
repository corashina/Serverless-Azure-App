import React, { Component } from "react"
import { Button } from "@material-ui/core"
import axios from "../utils/axios"
import { useHistory } from "react-router-dom"
import CircularProgress from "@material-ui/core/CircularProgress" 

class RegisterButtonComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {loading: false}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
    }
    componentDidMount() {
        window.addEventListener("keydown", this.handleKeydown)
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeydown)
    }
    handleKeydown(event) {
        if(event.keyCode === 13) this.handleSubmit()
    }
    handleSubmit() {
        
        if(this.props.state.password !== this.props.state.repassword) {
            return this.props.setErrors({password: "Password should match", repassword: "Password should match"})
        }

        const user = {
            username: this.props.state.username,
            password: this.props.state.password
        }
        
        this.setState({loading: true})

        axios.post("/api/users", user)
             .then(res => this.props.history.push("/login"))
             .catch(err => {
                this.setState({loading: false})  
                this.props.setErrors(err.response.data.errors)
             })
    }
    render() {

        const text = this.state.loading ? <CircularProgress size="1.5rem" style={{color: "#FFF"}}/>  : "Register"
        const width = "20%"

        return (
            <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{width}}>
                {text}
            </Button>
        )
    }
}


export default function RegisterButton({ state, setErrors }) {

    let history = useHistory();

    return (
        <RegisterButtonComponent state={state} setErrors={setErrors} history={history}/>
    )
}
