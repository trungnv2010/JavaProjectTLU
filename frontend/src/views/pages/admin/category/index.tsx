import {NextPage} from "next";
import {
    Box,
    Button, Grid, IconButton, useTheme,
} from "@mui/material";

import {AppDispatch, RootState} from "src/stores";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {deleteCategoryAsync, getAllCategoriesAsync} from "src/stores/apps/category";
import {useEffect, useState} from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import {GridColDef} from "@mui/x-data-grid";
import GridEdit from "src/components/grid-edit";
import GridDelete from "src/components/grid-delete";
import GridCreate from "src/components/grid-create";
import InputSearch from "src/components/input-search";
import CreateEditCategory from "src/views/pages/admin/category/components/CreateEditCategory";
import toast from "react-hot-toast";

type TProps = {};

const AdminCategoryPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch()
    const theme = useTheme()
    const router = useRouter()
    const [openCreateEdit, setOpenCreateEdit] = useState({
        open: false,
        id: "",
        data: {}
    })

    const {allData, loading, error} = useSelector((state: RootState) => state.category)
    const [searchBy, setSearchBy] = useState("")

    const handleGetListCategories = () => {
        dispatch(getAllCategoriesAsync({page: 0, limit: 10, search: searchBy}))
    }
    console.log("all data", allData)
    // Show error message if delete operation fails
    useEffect(() => {
        if (error.delete) {
            toast.error(`Delete category failed: ${error.delete}`);
        }
    }, [error.delete]);

    // Handle delete category with confirmation
    const handleDeleteCategory = (categoryId: string | number) => {
        // Add confirmation dialog
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategoryAsync(categoryId))
                .unwrap()
                .then(() => {
                    toast.success("Category deleted successfully!");
                })
                .catch((error) => {
                    // Error will be handled by the Redux state and shown via useEffect
                    console.error("Delete error:", error);
                });
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
        },
        {
            field: 'slug',
            headerName: 'Slug',
            width: 300,
            sortable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            sortable: true,
            width: 350,
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
                            handleDeleteCategory(params.row.id);
                        }}/>
                    </Box>
                )
            }
        }
    ];

    useEffect(() => {
        handleGetListCategories()
    }, [searchBy])

    return (
        <>
            <CreateEditCategory
                open={openCreateEdit.open}
                onClose={() => {
                    setOpenCreateEdit({
                        open: false,
                        id: "",
                        data: {}
                    })
                }}
                idCategory={openCreateEdit.id}
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

export default AdminCategoryPage