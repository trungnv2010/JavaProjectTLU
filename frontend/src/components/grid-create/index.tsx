import IconifyIcon from "src/components/Icon";
import * as React from "react";
import {IconButton, useTheme} from "@mui/material";


type TGridCreate= {
    onClick: () => void,
    disabled?: boolean
}

const GridCreate = (props: TGridCreate) => {
    const {onClick, disabled} = props
    const theme = useTheme()
    return (
        <IconButton onClick={onClick}
                    disabled={disabled}
                    sx={{backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}`}}>
            <IconifyIcon icon={"mdi-light:plus"}/>
        </IconButton>
    )
}
export default GridCreate