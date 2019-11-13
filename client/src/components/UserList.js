import React from "react"
import { List, ListItem, ListItemText, Divider, ListItemIcon, ListSubheader  } from "@material-ui/core"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"

export default function UserList({ name, data }) {

    return (
        <div>
            <List 
                component="nav" 
                subheader={
                    <ListSubheader style={{textAlign: "center"}} >
                      {name}: {data.length}
                    </ListSubheader>
                  } >
                {data.map((user, i) => 
                    <a key={i} href={`/users/${user}`}>
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={user} />
                        </ListItem>
                        <Divider />
                    </a>
                )}
            </List>
        </div>
    )
}
