import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from "@mui/material";
import CustomModal from "src/components/custom-modal";
import IconifyIcon from "src/components/Icon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/stores";
import { format } from "date-fns";
import {
    TOrderStatus,
    TPaymentStatus,
    TUpdateOrderStatusRequest,
    TUpdatePaymentStatusRequest,
} from "src/services/order";
import {
    updateOrderStatusAsync,
    updatePaymentStatusAsync,
} from "src/stores/apps/order";
import toast from "react-hot-toast";

type TOrderDetails = {
    open: boolean;
    onClose: () => void;
    orderId: string;
};

const OrderDetails = (props: TOrderDetails) => {
    const { open, onClose, orderId } = props;
    const theme = useTheme();
    const dispatch: AppDispatch = useDispatch();

    const { selectedOrder, loading, error } = useSelector(
        (state: RootState) => state.order
    );

    const [orderStatus, setOrderStatus] = useState<TOrderStatus | "">("");
    const [paymentStatus, setPaymentStatus] = useState<TPaymentStatus | "">("");

    React.useEffect(() => {
        if (selectedOrder) {
            setOrderStatus(selectedOrder.status);
            setPaymentStatus(selectedOrder.paymentStatus);
        }
    }, [selectedOrder]);

    React.useEffect(() => {
        if (error.updateStatus) {
            toast.error(`Failed to update order status: ${error.updateStatus}`);
        }
        if (error.updatePayment) {
            toast.error(`Failed to update payment status: ${error.updatePayment}`);
        }
    }, [error.updateStatus, error.updatePayment]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "dd MMMM yyyy, HH:mm");
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

    const handleOrderStatusChange = (event: any) => {
        setOrderStatus(event.target.value as TOrderStatus);
    };

    const handlePaymentStatusChange = (event: any) => {
        setPaymentStatus(event.target.value as TPaymentStatus);
    };

    const handleUpdateOrderStatus = () => {
        if (!orderStatus || orderStatus === selectedOrder?.status) return;

        const data: TUpdateOrderStatusRequest = {
            status: orderStatus as TOrderStatus,
        };

        dispatch(updateOrderStatusAsync({ id: orderId, data }))
            .unwrap()
            .then(() => {
                toast.success("Order status updated successfully!");
            })
            .catch((error) => {
                console.error("Update status error:", error);
            }).finally(() => {
                onClose()
        });
    };

    const handleUpdatePaymentStatus = () => {
        if (!paymentStatus || paymentStatus === selectedOrder?.paymentStatus) return;

        const data: TUpdatePaymentStatusRequest = {
            paymentStatus: paymentStatus as TPaymentStatus,
        };

        dispatch(updatePaymentStatusAsync({ id: orderId, data }))
            .unwrap()
            .then(() => {
                onClose();
                toast.success("Payment status updated successfully!");
            })
            .catch((error) => {
                console.error("Update payment status error:", error);
            }).finally(() => {
                onClose();
        });
    };

    if (!selectedOrder) {
        return null;
    }

    return (
        <CustomModal onClose={onClose} open={open}>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: "20px",
                    borderRadius: "15px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    width: "100%",
                }}
                minWidth={{ md: "800px" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "600" }}>
                        Order Details #{selectedOrder.id}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <IconifyIcon icon={"ic:baseline-close"} fontSize={24} />
                    </IconButton>
                </Box>

                <Grid container spacing={3}>
                    {/* Order Information */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Order Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(selectedOrder.createdAt || "")}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Customer
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedOrder.userName}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Shipping Address
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedOrder.shippingAddress}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Payment Method
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedOrder.paymentMethod}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Order Status
                                        </Typography>
                                        <Chip
                                            label={selectedOrder.status}
                                            color={getStatusColor(selectedOrder.status) as any}
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Payment Status
                                        </Typography>
                                        <Chip
                                            label={selectedOrder.paymentStatus}
                                            color={
                                                getPaymentStatusColor(selectedOrder.paymentStatus) as any
                                            }
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Order Items
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrder.orderItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    {item.productImageUrl && (
                                                        <Box
                                                            sx={{
                                                                width: "50px",
                                                                height: "50px",
                                                                marginRight: "10px",
                                                                borderRadius: "4px",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <img
                                                                src={item.productImageUrl}
                                                                alt={item.productName}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                    <Typography variant="body2">
                                                        {item.productName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                {formatPrice(item.price)}
                                            </TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="right">
                                                {formatPrice(item.price * item.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Total
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {formatPrice(selectedOrder.totalAmount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Update Status */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Update Order
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth disabled={selectedOrder.status === "cancelled"}>
                                        <InputLabel id="order-status-label">Order Status</InputLabel>
                                        <Select
                                            labelId="order-status-label"
                                            value={orderStatus}
                                            label="Order Status"
                                            onChange={handleOrderStatusChange}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="processing">Processing</MenuItem>
                                            <MenuItem value="shipped">Shipped</MenuItem>
                                            <MenuItem value="delivered">Delivered</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        disabled={
                                            orderStatus === selectedOrder.status ||
                                            orderStatus === "" ||
                                            selectedOrder.status === "cancelled" ||
                                            loading.updateStatus
                                        }
                                        onClick={handleUpdateOrderStatus}
                                    >
                                        Update Order Status
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="payment-status-label">
                                            Payment Status
                                        </InputLabel>
                                        <Select
                                            labelId="payment-status-label"
                                            value={paymentStatus}
                                            label="Payment Status"
                                            onChange={handlePaymentStatusChange}
                                        >
                                            <MenuItem value="unpaid">Unpaid</MenuItem>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="refunded">Refunded</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ mt: 2 }}
                                        disabled={
                                            paymentStatus === selectedOrder.paymentStatus ||
                                            paymentStatus === "" ||
                                            loading.updatePayment
                                        }
                                        onClick={handleUpdatePaymentStatus}
                                    >
                                        Update Payment Status
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </CustomModal>
    );
};

export default OrderDetails;