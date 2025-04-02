import {NextPage} from "next";
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    MenuItem,
    Rating,
    TextField,
    Typography,
    useTheme,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Divider,
} from "@mui/material";
import {AppDispatch, RootState} from "src/stores";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {
    deleteReviewAsync,
    getReviewsByProductIdAsync,
    getReviewsByUserIdAsync,
} from "src/stores/apps/review";
import {useEffect, useState} from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import {GridColDef} from "@mui/x-data-grid";
import InputSearch from "src/components/input-search";
import format from "date-fns/format";
import toast from "react-hot-toast";
import ReviewDetailDialog from "src/views/pages/admin/review/ReviewDetailDialog";
import GridEdit from "src/components/grid-edit";
import GridDelete from "src/components/grid-delete";
import { getAllUserAsync } from "src/stores/apps/user";
import { getAllProductsAsync } from "src/stores/apps/product";

type TProps = {};

interface UserOption {
    id: string;
    name: string;
    email?: string;
}

interface ProductOption {
    id: string;
    name: string;
    price?: number;
}

const AdminReviewsPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();

    const [openDetail, setOpenDetail] = useState({
        open: false,
        id: "",
    });

    const {data, total, loading, error} = useSelector(
        (state: RootState) => state.review
    );

    const users = useSelector((state: RootState) => state.user.allData);
    const products = useSelector((state: RootState) => state.product.allData);

    const [filterType, setFilterType] = useState("product");
    const [filterId, setFilterId] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [openUserSelect, setOpenUserSelect] = useState(false);
    const [openProductSelect, setOpenProductSelect] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [productSearchTerm, setProductSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllUserAsync({ page: -1, limit: -1 }));
        dispatch(getAllProductsAsync({ page: -1, limit: -1, search:"" }));
    }, [dispatch]);

    useEffect(() => {
        if (users && users.length > 0) {
            const options = users.map((user: any) => ({
                id: user.id.toString(),
                name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown User',
                email: user.email
            }));
            setUserOptions(options);
        }
    }, [users]);

    useEffect(() => {
        if (products && products.length > 0) {
            const options = products.map((product: any) => ({
                id: product.id.toString(),
                name: product.name || 'Unknown Product',
                price: product.price
            }));
            setProductOptions(options);
        }
    }, [products]);

    const handleGetReviews = () => {
        if (filterType === "product" && filterId) {
            dispatch(
                getReviewsByProductIdAsync({
                    productId: filterId,
                    page,
                    limit,
                    sortBy: "createdAt",
                    direction: "desc",
                })
            );
        } else if (filterType === "user" && filterId) {
            dispatch(
                getReviewsByUserIdAsync({
                    userId: filterId,
                    page,
                    limit,
                })
            );
        }
    };

    const handleDeleteReview = (reviewId: string | number, productId: string | number) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            dispatch(deleteReviewAsync({id: reviewId, productId}))
                .unwrap()
                .then(() => {
                    toast.success("Review deleted successfully!");
                })
                .catch((error) => {
                    toast.error(`Failed to delete review: ${error}`);
                });
        }
    };

    const handleViewDetail = (id: string | number) => {
        setOpenDetail({
            open: true,
            id: id.toString(),
        });
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd MMM yyyy");
        } catch (error) {
            return dateString;
        }
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            width: 70,
        },
        {
            field: "userName",
            headerName: "User",
            width: 150,
        },
        {
            field: "productName",
            headerName: "Product",
            width: 200,
        },
        {
            field: "rating",
            headerName: "Rating",
            width: 150,
            renderCell: (params) => (
                <Rating value={params.row.rating} readOnly size="small"/>
            ),
        },
        {
            field: "comment",
            headerName: "Comment",
            width: 300,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {params.row.comment}
                </Typography>
            ),
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 120,
            renderCell: (params) => formatDate(params.row.createdAt),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <GridEdit onClick={() => {
                        handleViewDetail(params.row.id)
                    }}/>
                    <GridDelete onClick={() => {
                        handleDeleteReview(params.row.id, params.row.productId)
                    }}/>
                </Box>
            ),
        },
    ];

    useEffect(() => {
        if (filterId) {
            handleGetReviews();
        }
    }, [page, limit, filterId, filterType]);

    useEffect(() => {
        if (error.delete) {
            toast.error(`Delete failed: ${error.delete}`);
        }
    }, [error.delete]);

    const handleOpenUserSelect = () => {
        setOpenUserSelect(true);
    };

    const handleCloseUserSelect = () => {
        setOpenUserSelect(false);
    };

    const handleOpenProductSelect = () => {
        setOpenProductSelect(true);
    };

    const handleCloseProductSelect = () => {
        setOpenProductSelect(false);
    };

    const handleUserSelect = (user: UserOption) => {
        setSelectedUser(user);
        setFilterId(user.id);
        handleCloseUserSelect();
    };

    const handleProductSelect = (product: ProductOption) => {
        setSelectedProduct(product);
        setFilterId(product.id);
        handleCloseProductSelect();
    };

    const filteredUserOptions = userOptions.filter(
        user => user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );

    const filteredProductOptions = productOptions.filter(
        product => product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );

    return (
        <>
            <ReviewDetailDialog
                open={openDetail.open}
                onClose={() => setOpenDetail({open: false, id: ""})}
                reviewId={openDetail.id}
            />

            <Dialog open={openUserSelect} onClose={handleCloseUserSelect} maxWidth="sm" fullWidth>
                <DialogTitle>Select User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search Users"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {filteredUserOptions.length > 0 ? (
                            filteredUserOptions.map((user) => (
                                <React.Fragment key={user.id}>
                                    <ListItem button onClick={() => handleUserSelect(user)}>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.email}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No users found" />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>

            <Dialog open={openProductSelect} onClose={handleCloseProductSelect} maxWidth="sm" fullWidth>
                <DialogTitle>Select Product</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search Products"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {filteredProductOptions.length > 0 ? (
                            filteredProductOptions.map((product) => (
                                <React.Fragment key={product.id}>
                                    <ListItem button onClick={() => handleProductSelect(product)}>
                                        <ListItemText
                                            primary={product.name}
                                            secondary={product.price ? `$${product.price}` : undefined}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No products found" />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>

            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    display: "flex",
                    alignItems: "center",
                    padding: "40px",
                    borderRadius: "5px",
                }}
            >
                <Grid container>
                    <Grid item md={12} xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                mb: 4,
                            }}
                        >
                            <Typography variant="h4">Review Management</Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    select
                                    label="Filter By"
                                    size="small"
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value);
                                        setFilterId("");
                                        setSelectedUser(null);
                                        setSelectedProduct(null);
                                    }}
                                    sx={{width: {xs: "100%", md: "150px"}}}
                                >
                                    <MenuItem value="product">Product</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </TextField>

                                <Box sx={{
                                    width: {xs: "100%", md: "300px"},
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}>
                                    {filterType === "user" ? (
                                        <>
                                            <TextField
                                                fullWidth
                                                label="User"
                                                size="small"
                                                value={selectedUser ? selectedUser.name : ""}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                onClick={handleOpenUserSelect}
                                                sx={{ cursor: "pointer" }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleOpenUserSelect}
                                            >
                                                Select
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                fullWidth
                                                label="Product"
                                                size="small"
                                                value={selectedProduct ? selectedProduct.name : ""}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                onClick={handleOpenProductSelect}
                                                sx={{ cursor: "pointer" }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleOpenProductSelect}
                                            >
                                                Select
                                            </Button>
                                        </>
                                    )}
                                </Box>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!filterId}
                                    onClick={handleGetReviews}
                                >
                                    Search
                                </Button>
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
                            paginationMode="server"
                            rowCount={total}
                            page={page}
                            pageSize={limit}
                            onPageChange={(newPage) => setPage(newPage)}
                            onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
                            getRowId={(row) => row.id}
                            checkboxSelection={false}
                            disableRowSelectionOnClick
                            loading={loading.fetchAll}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AdminReviewsPage;