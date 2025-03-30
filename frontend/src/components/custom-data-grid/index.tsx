import React from 'react';
import Box from '@mui/material/Box';
import {DataGrid, DataGridProps} from '@mui/x-data-grid';
import {styled} from "@mui/material";
import {forwardRef, Ref} from "react";


const StyleCustomGrid = styled(DataGrid)<DataGridProps>(({theme})=> ({
    "& .MuiDataGrid-main": {
        border: `1px solid ${theme.palette.customColors.borderColor}`,
        borderRadius: "8px"
    }
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) =>  {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <StyleCustomGrid
                {...props}
            />
        </Box>
    );
})

export default CustomDataGrid
