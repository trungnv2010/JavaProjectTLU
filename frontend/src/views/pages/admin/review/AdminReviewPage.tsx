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

type TProps = {};

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

    const [filterType, setFilterType] = useState("product");
    const [filterId, setFilterId] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

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

    return (
        <>
            <ReviewDetailDialog
                open={openDetail.open}
                onClose={() => setOpenDetail({open: false, id: ""})}
                reviewId={openDetail.id}
            />
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
                                    }}
                                    sx={{width: {xs: "100%", md: "150px"}}}
                                >
                                    <MenuItem value="product">Product</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </TextField>

                                <Box sx={{width: {xs: "100%", md: "220px"}}}>
                                    <TextField
                                        fullWidth
                                        label={filterType === "product" ? "Product ID" : "User ID"}
                                        size="small"
                                        value={filterId}
                                        onChange={(e) => setFilterId(e.target.value)}
                                    />
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