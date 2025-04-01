import {NextPage} from "next";
import {
    Box,
    Button, Grid, IconButton, useTheme,
} from "@mui/material";

import {AppDispatch, RootState} from "src/stores";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {deleteUserAsync, getAllUserAsync} from "src/stores/apps/user";
import {useEffect, useState} from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import {GridColDef} from "@mui/x-data-grid";
import GridEdit from "src/components/grid-edit";
import GridDelete from "src/components/grid-delete";
import GridCreate from "src/components/grid-create";
import InputSearch from "src/components/input-search";
import CreateEditUser from "src/views/pages/admin/user/components/CreateEditUser";
import toast from "react-hot-toast";

type TProps = {};

const AdminUserPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch()
    const theme = useTheme()
    const router = useRouter()
    const [openCreateEdit, setOpenCreateEdit] = useState({
        open: false,
        id: "",
        data: {}
    })

    const {allData, loading, error} = useSelector((state: RootState) => state.user)
    const [searchBy, setSearchBy] = useState("")

    const handleGetListUser = () => {
        dispatch(getAllUserAsync({page: -1, limit: -1, search: searchBy}))
    }

    // Show error message if delete operation fails
    useEffect(() => {
        if (error.delete) {
            toast.error(`Delete user failed: ${error.delete}`);
        }
    }, [error.delete]);

    // Handle delete user with confirmation
    const handleDeleteUser = (userId: string | number) => {
        // You could add a confirmation dialog here
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUserAsync(userId))
                .unwrap()
                .then(() => {
                    toast.success("User deleted successfully!");
                })
                .catch((error) => {
                    // Error will be handled by the Redux state and shown via useEffect
                    console.error("Delete error:", error);
                });
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'email',
            headerName: 'Email',
            width: 300,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: true,
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
            renderCell: (params) => {
                return (
                    <Box>
                        <GridEdit onClick={() => {
                            setOpenCreateEdit({
                                open: true,
                                id: params.row.id,
                                data: params.row
                            })
                        }}/>
                        <GridDelete onClick={() => {
                            handleDeleteUser(params.row.id);
                        }}/>
                    </Box>
                )
            }
        }
    ];

    useEffect(() => {
        handleGetListUser()
    }, [searchBy])

    return (
        <>
            <CreateEditUser
                open={openCreateEdit.open}
                onClose={() => {
                    setOpenCreateEdit({
                        open: false,
                        id: "",
                        data: {}
                    })
                }}
                idUser={openCreateEdit.id}
                data={openCreateEdit.data}
            />
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
                                <InputSearch value={searchBy} onChange={(value) => setSearchBy(value)}/>
                            </Box>
                            <GridCreate onClick={() => setOpenCreateEdit({
                                    open: true,
                                    id: "",
                                    data: {}
                                }
                            )}/>
                        </Box>
                        <CustomDataGrid
                            rows={allData}
                            columns={columns}
                            pageSizeOption={[5]}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            getRowId={(row) => row.id}
                            checkboxSelection={false}
                            disableRowSelectionOnClick
                            loading={loading.fetchAll}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default AdminUserPage