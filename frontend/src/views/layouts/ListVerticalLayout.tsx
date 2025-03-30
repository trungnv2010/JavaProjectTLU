import * as React from 'react';

import {NextPage} from "next";
import List from '@mui/material/List';
import {Collapse, ListItemButton, ListItemIcon, ListItemText, ListSubheader, useTheme} from "@mui/material";
import IconifyIcon from "src/components/Icon";
import {VerticalItems} from "src/configs/layout";
import {useState} from "react";
import {router} from "next/client";
import {useRouter} from "next/router";


type TProps = {}


const ListVerticalLayout: NextPage<TProps> = () => {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const router = useRouter()
    const [activePath, setActivePath] = useState<null | string>("")
    const handleSelectItem = (path: string) => {
        setActivePath(path)
        router.push(path)
    }
    return (
        <List
            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', paddingLeft: 3}}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {VerticalItems && VerticalItems?.map((item) => {
                return (
                    <React.Fragment key={item.title}>
                        <ListItemButton
                            onClick={() => handleSelectItem(item.path)}
                            sx={{
                                backgroundColor: item.path === activePath ? "#c1c1f0" : "",
                                width: "90%", borderRadius: 20
                            }}
                        >
                            <ListItemIcon>
                                <IconifyIcon icon={item.icon}/>
                            </ListItemIcon>
                            <ListItemText primary={item.title}/>
                        </ListItemButton>
                    </React.Fragment>
                )
            })}
        </List>
    );
}

export default ListVerticalLayout