import * as React from 'react';

import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import {NextPage} from "next";
import {AppBar, Button} from "@mui/material";
import IconifyIcon from "src/components/Icon";
import UserDropDown from "src/components/user";
import {useAuth} from "src/hooks/useAuth";
import {useRouter} from "next/router";
import {ROUTE_CONFIG} from "src/configs/route";


type TProps = {
    open: boolean,
    toggleDrawer: () => void
}


const HorizontalLayout: NextPage<TProps> = () => {
    const {user} = useAuth()
    const router = useRouter()
    return (
        <AppBar position="absolute">
            <Toolbar
                sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}
            >
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{flexGrow: 1}}
                >
                    <IconButton onClick={() => router.push('/')}>
                        <IconifyIcon icon={"material-symbols-light:home-outline-rounded"} color={"white"} fontSize={40} />
                    </IconButton>
                </Typography>
                <IconButton color="inherit" sx={{marginRight: 5}}>
                    <Badge badgeContent={4} color="secondary">
                        <IconifyIcon icon={"ion:notifications-sharp"}/>
                    </Badge>
                </IconButton>
                {user ? (<UserDropDown/>)
                    : (<Button
                        sx={{width: "auto", border: "1px solid white"}}
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(ROUTE_CONFIG.LOGIN)}
                    >
                        Sign In
                    </Button>)}


            </Toolbar>
        </AppBar>


    );
}

export default HorizontalLayout