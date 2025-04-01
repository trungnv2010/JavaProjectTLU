import {NextPage} from "next";
import {
    Box,
    Button, Chip, Grid, IconButton, useTheme,
} from "@mui/material";

import {AppDispatch, RootState} from "src/stores";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {deleteProductAsync, getAllProductsAsync} from "src/stores/apps/product";
import {useEffect, useState} from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import {GridColDef} from "@mui/x-data-grid";
import GridEdit from "src/components/grid-edit";
import GridDelete from "src/components/grid-delete";
import GridCreate from "src/components/grid-create";
import InputSearch from "src/components/input-search";
import CreateEditProduct from "src/views/pages/admin/product/components/CreateEditProduct";
import toast from "react-hot-toast";

type TProps = {};

const AdminProductPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch()
    const theme = useTheme()
    const router = useRouter()
    const [openCreateEdit, setOpenCreateEdit] = useState({
        open: false,
        id: "",
        data: {}
    })

    const {data, allData, loading, error} = useSelector((state: RootState) => state.product)
    const [searchBy, setSearchBy] = useState("")
    const [sortBy, setSortBy] = useState("id")
    const [direction, setDirection] = useState("asc")

    const handleGetListProducts = () => {
        dispatch(getAllProductsAsync({page: 0, limit: 10, search: searchBy, sortBy, direction}))
    }

    useEffect(() => {
        if (error.delete) {
            toast.error(`Delete product failed: ${error.delete}`);
        }
    }, [error.delete]);

    const handleDeleteProduct = (productId: string | number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProductAsync(productId))
                .unwrap()
                .then(() => {
                    toast.success("Product deleted successfully!");
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                });
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const columns: GridColDef[] = [
        {
            field: 'imageUrl',
            headerName: 'Image',
            width: 100,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Box sx={{height: '50px', width: '50px', overflow: 'hidden', borderRadius: '4px'}}>
                        {params.row.imageUrl ? (
                            <img
                                src={params.row.imageUrl}
                                alt={params.row.name}
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        ) : (
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5'
                            }}>
                                No Image
                            </Box>
                        )}
                    </Box>
                )
            }
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            renderCell: (params) => {
                return formatPrice(params.row.price);
            }
        },
        {
            field: 'discountPrice',
            headerName: 'Discount',
            width: 120,
            renderCell: (params) => {
                return params.row.discountPrice ? formatPrice(params.row.discountPrice) : '-';
            }
        },
        {
            field: 'stockQuantity',
            headerName: 'Stock',
            width: 100,
            renderCell: (params) => {
                const stockLevel = params.row.stockQuantity;
                let color = 'success';

                if (stockLevel <= 0) {
                    color = 'error';
                } else if (stockLevel < 10) {
                    color = 'warning';
                }

                return (
                    <Chip
                        label={stockLevel}
                        color={color as any}
                        size="small"
                    />
                );
            }
        },
        {
            field: 'brand',
            headerName: 'Brand',
            width: 120,
        },
        {
            field: 'categoryName',
            headerName: 'Category',
            width: 150,
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
                            handleDeleteProduct(params.row.id);
                        }}/>
                    </Box>
                )
            }
        }
    ];

    useEffect(() => {
        handleGetListProducts()
    }, [searchBy, sortBy, direction])

    return (
        <>
            <CreateEditProduct
                open={openCreateEdit.open}
                onClose={() => {
                    setOpenCreateEdit({
                        open: false,
                        id: "",
                        data: {}
                    })
                }}
                idProduct={openCreateEdit.id}
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
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            mb: 2,
                            flexWrap: {xs: 'wrap', md: 'nowrap'},
                            gap: 2
                        }}>
                            <Box sx={{width: {xs: '100%', md: '300px'}}}>
                                <InputSearch
                                    value={searchBy}
                                    onChange={(value) => setSearchBy(value)}
                                    placeholder="Search products..."
                                />
                            </Box>
                            <Box sx={{display: 'flex', gap: 2}}>
                                <GridCreate
                                    onClick={() => setOpenCreateEdit({
                                        open: true,
                                        id: "",
                                        data: {}
                                    })}
                                    label="Add Product"
                                />
                            </Box>
                        </Box>
                        <CustomDataGrid
                            rows={data}
                            columns={columns}
                            pageSizeOption={[10, 25, 50]}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
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

export default AdminProductPage