import React, { Component } from "react"
import { useHistory } from "react-router-dom"
import { Button } from "@material-ui/core"
import axios from "../utils/axios"
import CircularProgress from "@material-ui/core/CircularProgress"

class LoginButtonComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false }
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

    const errors = {}

    if(this.props.state.username.length === 0) errors.username = "Username cannot be empty"
    if(this.props.state.password.length === 0) errors.password = "Password cannot be empty"
    
    if(Object.entries(errors).length !== 0) return this.props.setErrors(errors)

    const user = {
        username: this.props.state.username,
        password: this.props.state.password
    }

    this.setState({loading: true})

    axios.post(`/api/users/auth`, user)
         .then(res => {

            const token = res.data.token

            localStorage.setItem("jwt", token)
            axios.defaults.headers.common["authorization"] = token
            
            this.props.history.push("/");

         })
         .catch(err =>  {
            this.setState({loading: false})
            this.props.setErrors(err.response.data.errors)
         })
         
  }
  render() {

    const text = this.state.loading ? <CircularProgress style={{color: "#FFF"}} size="1.5rem" /> : "Login"
    const width = "20%"

    return (
      <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{width}}>
          {text}
      </Button>
    )
  }
}


export default function LoginButton({ state, setErrors}) {

  let history = useHistory();

  return (
    <LoginButtonComponent state={state} setErrors={setErrors} history={history}/>
  )
}
 
