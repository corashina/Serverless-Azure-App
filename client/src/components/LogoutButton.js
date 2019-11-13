import React from "react"
import { useHistory } from "react-router-dom"
import { Button  } from "@material-ui/core"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"

export default function LogoutButton() {

    let history = useHistory();
  
    function handleSubmit() {
        localStorage.removeItem("jwt")
        history.push("/login");
    }
  
    return (
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        endIcon={<PowerSettingsNewIcon/>}
        fullWidth
      >
          Logout
      </Button>
    )
}

