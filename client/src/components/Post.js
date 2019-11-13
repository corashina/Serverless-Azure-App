import React from 'react'
import { Typography, ListItemIcon, ListItem, ListItemText, Divider } from "@material-ui/core"
import dateFormat from "dateformat"
import DeleteIcon from "@material-ui/icons/Delete"
import ChatIcon from "@material-ui/icons/Chat"

export default function Post({ user, remove, data }) {

    const date = dateFormat(new Date(data.date), "dddd, mmmm dS, yyyy, h:MM:ss TT");

    const icon = user === data.author ? (<DeleteIcon onClick={() => remove(data._id)}/>) : (<ChatIcon/>)

    return (
        <div>
        <ListItem button alignItems="flex-start">
            <ListItemIcon >
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={
            <React.Fragment>
                <Typography
                    component="span"
                    variant="body2"
                >
                     {data.text} 
                </Typography>
                <br />
                <Typography
                    component="span"
                    variant="body2"
                    style={{color: "blue"}}
                >
                     {data.author} 
                </Typography>
                <br />
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    {date}
                </Typography>
            </React.Fragment>
          }
             />
        </ListItem>
        <Divider />
        </div>
    )
}
