import IconifyIcon from "src/components/Icon";
import * as React from "react";
import {IconButton, InputBase, styled, useTheme} from "@mui/material";



type TSearch = {}

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    marginLeft: '0 !important',
    height: "38px",
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    height: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        width: "100%",
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

const InputSearch = (props: TSearch) => {
    const theme = useTheme()
    return (
       <Search>
           <SearchIconWrapper>
               <IconifyIcon icon={"iconamoon:search-thin"} />
           </SearchIconWrapper>
           <StyledInputBase placeholder={"Search..."} inputProps={{'arial-label': 'search'}} />
       </Search>
    )
}
export default InputSearch