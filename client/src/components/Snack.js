import React from "react"
import { Snackbar } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"

export default function Snack({open, setOpen, message}) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            message={<span id="message-id">{message}</span>}
            style={{width: "min-content"}}
            action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>,
              ]}
        />
    )
}
