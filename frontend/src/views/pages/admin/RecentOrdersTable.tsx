import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Box,
    Typography,
    Button,
    useTheme
} from '@mui/material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

// Mock data for recent orders
const mockRecentOrders = [
    {
        id: 'ORD-3289',
        customer: {
            name: 'Thomas Smith',
            avatar: '/path/to/avatar1.jpg'
        },
        date: new Date(2023, 3, 12),
        amount: 342.99,
        status: 'delivered',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-3288',
        customer: {
            name: 'Emma Johnson',
            avatar: '/path/to/avatar2.jpg'
        },
        date: new Date(2023, 3, 11),
        amount: 189.50,
        status: 'shipped',
        paymentMethod: 'PayPal'
    },
    {
        id: 'ORD-3287',
        customer: {
            name: 'Michael Brown',
            avatar: '/path/to/avatar3.jpg'
        },
        date: new Date(2023, 3, 11),
        amount: 124.00,
        status: 'processing',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-3286',
        customer: {
            name: 'Sophia Davis',
            avatar: '/path/to/avatar4.jpg'
        },
        date: new Date(2023, 3, 10),
        amount: 89.95,
        status: 'pending',
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'ORD-3285',
        customer: {
            name: 'James Wilson',
            avatar: '/path/to/avatar5.jpg'
        },
        date: new Date(2023, 3, 10),
        amount: 275.20,
        status: 'cancelled',
        paymentMethod: 'PayPal'
    }
];

const RecentOrdersTable = () => {
    const theme = useTheme();
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'success';
            case 'shipped':
                return 'primary';
            case 'processing':
                return 'info';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    };

    const formatDate = (date: Date) => {
        return format(date, 'MMM dd, yyyy');
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleViewOrder = (orderId: string) => {
        router.push(`/admin/order/${orderId}`);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockRecentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            width: 32,
                                            height: 32,
                                            mr: 1
                                        }}
                                    >
                                        {getInitials(order.customer.name)}
                                    </Avatar>
                                    <Typography variant="body2">
                                        {order.customer.name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                            <TableCell>{formatAmount(order.amount)}</TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell>
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status) as any}
                                    size="small"
                                    sx={{ textTransform: 'capitalize' }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleViewOrder(order.id)}
                                >
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RecentOrdersTable;