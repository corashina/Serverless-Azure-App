import React from "react"
import { Link } from "react-router-dom"
import { Grid, Button  } from "@material-ui/core"

export default function HomeMenu() {
  
    const width = "20%"
    const margin = "0.5%"

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '90vh' }}
        >
            <Link to="/login" style={{width, margin}}>
                <Button variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </Link>
            <Link to="/register" style={{width, margin}}>
                <Button variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </Link>
        </Grid> 
    )
  }