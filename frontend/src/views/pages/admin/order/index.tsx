import { NextPage } from "next";
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";


import { AppDispatch, RootState } from "src/stores";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    cancelOrderAsync,
    getOrderByIdAsync,
    searchOrdersAsync,
} from "src/stores/apps/order";
import { useEffect, useState } from "react";
import CustomDataGrid from "src/components/custom-data-grid";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import InputSearch from "src/components/input-search";
import OrderDetails from "src/views/pages/admin/order/components/OrderDetails";
import format from "date-fns/format";
import toast from "react-hot-toast";
import { TOrderStatus, TPaymentStatus } from "src/services/order";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";

type TProps = {};

const AdminOrderPage: NextPage<TProps> = () => {
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();

    const [openDetails, setOpenDetails] = useState({
        open: false,
        id: "",
    });

    const { data, total, loading, error } = useSelector(
        (state: RootState) => state.order
    );

    const [searchParams, setSearchParams] = useState({
        search: "",
        status: "",
        startDate: null as Date | null,
        endDate: null as Date | null,
        page: 0,
        limit: 10,
    });

    const handleGetOrders = () => {
        const params = {
            ...searchParams,
            startDate: searchParams.startDate
                ? format(searchParams.startDate, "yyyy-MM-dd HH:mm:ss")
                : undefined,
            endDate: searchParams.endDate
                ? format(searchParams.endDate, "yyyy-MM-dd HH:mm:ss")
                : undefined,
        };

        dispatch(searchOrdersAsync(params));
    };

    useEffect(() => {
        if (error.cancel) {
            toast.error(`Cancel order failed: ${error.cancel}`);
        }
    }, [error.cancel]);

    const handleCancelOrder = (orderId: string | number) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            dispatch(cancelOrderAsync(orderId))
                .unwrap()
                .then(() => {
                    toast.success("Order cancelled successfully!");
                })
                .catch((error) => {
                    console.error("Cancel error:", error);
                });
        }
    };

    const handleViewOrderDetails = (orderId: string | number) => {
        dispatch(getOrderByIdAsync(orderId))
            .unwrap()
            .then(() => {
                setOpenDetails({
                    open: true,
                    id: orderId.toString(),
                });
            })
            .catch((error) => {
                toast.error(`Error loading order details: ${error}`);
            });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "dd MMM yyyy, HH:mm");
    };

    const getStatusColor = (status: TOrderStatus) => {
        switch (status) {
            case "pending":
                return "warning";
            case "processing":
                return "info";
            case "shipped":
                return "primary";
            case "delivered":
                return "success";
            case "cancelled":
                return "error";
            default:
                return "default";
        }
    };

    const getPaymentStatusColor = (status: TPaymentStatus) => {
        switch (status) {
            case "paid":
                return "success";
            case "unpaid":
                return "warning";
            case "refunded":
                return "error";
            default:
                return "default";
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchParams({ ...searchParams, search: value });
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ ...searchParams, status: event.target.value });
    };

    const handleStartDateChange = (date: Date | null) => {
        setSearchParams({ ...searchParams, startDate: date });
    };

    const handleEndDateChange = (date: Date | null) => {
        setSearchParams({ ...searchParams, endDate: date });
    };

    const handleResetFilters = () => {
        setSearchParams({
            search: "",
            status: "",
            startDate: null,
            endDate: null,
            page: 0,
            limit: 10,
        });
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Order ID",
            width: 80,
        },
        {
            field: "userName",
            headerName: "Customer",
            width: 160,
        },
        {
            field: "totalAmount",
            headerName: "Total",
            width: 120,
            renderCell: (params) => {
                return formatPrice(params.row.totalAmount);
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => {
                return (
                    <Chip
                        label={params.row.status}
                        color={getStatusColor(params.row.status) as any}
                        size="small"
                    />
                );
            },
        },
        {
            field: "paymentStatus",
            headerName: "Payment",
            width: 120,
            renderCell: (params) => {
                return (
                    <Chip
                        label={params.row.paymentStatus}
                        color={getPaymentStatusColor(params.row.paymentStatus) as any}
                        size="small"
                    />
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 180,
            renderCell: (params) => {
                return formatDate(params.row.createdAt);
            },
        },
        {
            field: "paymentMethod",
            headerName: "Payment Method",
            width: 150,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton
                            onClick={() => handleViewOrderDetails(params.row.id)}
                            size="small"
                            color="primary"
                        >
                            <i className="fa-solid fa-eye"></i>
                        </IconButton>

                        {params.row.status !== "delivered" && params.row.status !== "cancelled" && (
                            <IconButton
                                onClick={() => handleCancelOrder(params.row.id)}
                                size="small"
                                color="error"
                            >
                                <i className="fa-solid fa-ban"></i>
                            </IconButton>
                        )}
                    </Box>
                );
            },
        },
    ];

    useEffect(() => {
        handleGetOrders();
    }, [searchParams.page, searchParams.limit]);

    return (
        <>
            <OrderDetails
                open={openDetails.open}
                onClose={() => {
                    setOpenDetails({
                        open: false,
                        id: "",
                    });
                }}
                orderId={openDetails.id}
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
                            <Typography variant="h4">Order Management</Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <Box sx={{ width: { xs: "100%", md: "230px" } }}>
                                    <InputSearch
                                        value={searchParams.search}
                                        onChange={handleSearchChange}
                                        placeholder="Search orders..."
                                    />
                                </Box>

                                <TextField
                                    select
                                    label="Status"
                                    size="small"
                                    value={searchParams.status}
                                    onChange={handleStatusChange}
                                    sx={{ width: { xs: "100%", md: "150px" } }}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="processing">Processing</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </TextField>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="From Date"
                                        value={searchParams.startDate}
                                        onChange={handleStartDateChange}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="To Date"
                                        value={searchParams.endDate}
                                        onChange={handleEndDateChange}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </LocalizationProvider>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGetOrders}
                                >
                                    Search
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleResetFilters}
                                >
                                    Reset
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
                            page={searchParams.page}
                            pageSize={searchParams.limit}
                            onPageChange={(newPage) =>
                                setSearchParams({...searchParams, page: newPage})
                            }
                            onPageSizeChange={(newPageSize) =>
                                setSearchParams({...searchParams, limit: newPageSize})
                            }
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

export default AdminOrderPage;