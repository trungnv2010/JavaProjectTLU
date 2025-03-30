import {NextPage} from "next";
import {
    Box,
    Button, Grid, IconButton, useTheme,
} from "@mui/material";

import {AppDispatch, RootState} from "src/stores";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {getAllUserAsync} from "src/stores/apps/user";
import {useEffect, useState} from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import {GridColDef} from "@mui/x-data-grid";
import GridEdit from "src/components/grid-edit";
import GridDelete from "src/components/grid-delete";
import GridCreate from "src/components/grid-create";
import InputSearch from "src/components/input-search";
import CreateEditUser from "src/views/pages/admin/user/components/CreateEditUser";


type TProps = {}


const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: 'email',
        headerName: 'Email',
        width: 300,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 250,
        valueGetter: (params) => {
            if (!params.row) return '';
            return `${params.row.firstname || ''} ${params.row.lastname || ''}`;
        },
    },
    {
        field: 'city',
        headerName: 'City',
        width: 150,
    },
    {
        field: 'phone',
        headerName: 'Phone Number',
        width: 200,
    },
    {
        headerName: 'Action',
        width: 120,
        sortable: false,
        renderCell: () => {
            return (
                <Box>
                    <GridEdit onClick={() => {
                    }}/>
                    <GridDelete onClick={() => {
                    }}/>
                </Box>
            )
        }
    }
];


const AdminUserPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch()
    const theme = useTheme()
    const router = useRouter()
    const [openCreateEdit, setOpenCreateEdit] = useState({
        open: false,
        id: ""
    })

    const {allData} = useSelector((state: RootState) => state.user)
    const handleGetListUser = () => {
        dispatch(getAllUserAsync({page: -1, limit: -1}))
    }
    const PaginationComponent = () => {

    }
    console.log("id", openCreateEdit.id)
    useEffect(() => {
        handleGetListUser()
    }, [])
    return (
        <>
            <CreateEditUser open={openCreateEdit.open} onClose={() => {
                setOpenCreateEdit({
                    open: false,
                    id: ""
                })
            }} idUser={openCreateEdit.id}/>
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                alignItems: "center",
                padding: "40px",
                borderRadius: "5px"
            }}>
                <Grid container>
                    <Grid item md={12} xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "space-between", mb: 2}}>
                            <Box sx={{width: '200px'}}>
                                <InputSearch/>
                            </Box>
                            <GridCreate onClick={() => setOpenCreateEdit({
                                    open: true,
                                    id: ""
                                }
                            )}/>

                        </Box>
                        <CustomDataGrid
                            rows={allData}
                            columns={columns}
                            pageSizeOptions={[5]}
                            getRowId={(row) => row.id}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default AdminUserPage