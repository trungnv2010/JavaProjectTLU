import IconifyIcon from "src/components/Icon";
import * as React from "react";
import {IconButton} from "@mui/material";


type TGridDelete = {
    onClick: () => void,
    disabled?: boolean
}

const GridDelete = (props: TGridDelete) => {
    const {onClick, disabled} = props
    return (
        <IconButton onClick={onClick}
                    disabled={disabled}>
            <IconifyIcon icon={"mdi-light:delete"}/>
        </IconButton>
    )
}
export default GridDelete