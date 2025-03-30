import IconifyIcon from "src/components/Icon";
import * as React from "react";
import {IconButton} from "@mui/material";


type TGridEdit = {
    onClick: () => void,
    disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
    const {onClick, disabled} = props
    return (
        <IconButton onClick={onClick}
                    disabled={disabled}>
            <IconifyIcon icon={"mingcute:edit-line"}/>
        </IconButton>
    )
}
export default GridEdit