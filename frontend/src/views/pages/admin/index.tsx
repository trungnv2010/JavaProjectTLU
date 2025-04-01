import {NextPage} from "next";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    Avatar,
    Divider,
    Button,
    Paper,
    Stack,
    LinearProgress,
    Tab,
    Tabs,
} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import {Bar, Line, Pie, Doughnut} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/stores";
import {getOrderStatisticsAsync} from "src/stores/apps/order";

import {format} from "date-fns";

import RecentOrdersTable from "./RecentOrdersTable";
import IconifyIcon from "src/components/Icon";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type TProps = {};

const AdminDashboard: NextPage<TProps> = () => {
    const theme = useTheme();
    const dispatch: AppDispatch = useDispatch();
    const {statistics} = useSelector((state: RootState) => state.order);
    const [dateRange, setDateRange] = useState("weekly");

    useEffect(() => {
        dispatch(getOrderStatisticsAsync());
        // Additional API calls for the dashboard can be added here
    }, [dispatch]);

    // Mock data for dashboard
    const salesData = {
        weekly: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Revenue",
                    data: [12500, 19000, 14000, 22000, 18000, 24000, 32000],
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main,
                    tension: 0.4,
                },
            ],
        },
        monthly: {
            labels: Array.from({length: 30}, (_, i) => (i + 1).toString()),
            datasets: [
                {
                    label: "Revenue",
                    data: Array.from({length: 30}, () => Math.floor(Math.random() * 30000) + 10000),
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main,
                    tension: 0.4,
                },
            ],
        },
        yearly: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "Revenue",
                    data: [
                        125000,
                        145000,
                        132000,
                        147000,
                        156000,
                        165000,
                        178000,
                        188000,
                        202000,
                        219000,
                        229000,
                        245000
                    ],
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main,
                    tension: 0.4,
                },
            ],
        },
    };

    const ordersChartData = {
        labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        datasets: [
            {
                data: [25, 35, 15, 40, 10],
                backgroundColor: [
                    "#FFB861",
                    "#36A2EB",
                    "#4C84FF",
                    "#4CAF50",
                    "#F44336",
                ],
                borderWidth: 0,
            },
        ],
    };

    const categoryChartData = {
        labels: ["Electronics", "Clothing", "Books", "Home & Kitchen", "Beauty", "Others"],
        datasets: [
            {
                label: "Products by Category",
                data: [120, 85, 60, 45, 30, 25],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#C9CBCF",
                ],
            },
        ],
    };

    const userActivityData = {
        labels: Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return format(date, "MMM dd");
        }),
        datasets: [
            {
                label: "New Users",
                data: [5, 8, 12, 7, 10, 15, 9],
                backgroundColor: theme.palette.secondary.main,
            },
            {
                label: "Active Users",
                data: [30, 25, 35, 28, 32, 40, 38],
                backgroundColor: theme.palette.primary.main,
            },
        ],
    };

    // Top selling products
    const topProducts = [
        {name: "Smartphone XS Max", sales: 142, percent: 100},
        {name: "Wireless Headphones", sales: 97, percent: 68},
        {name: "Smartwatch Pro", sales: 65, percent: 46},
        {name: "Laptop Ultra", sales: 52, percent: 37},
        {name: "Bluetooth Speaker", sales: 38, percent: 27},
    ];

    const [tabValue, setTabValue] = useState("1");

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" sx={{mb: 4}}>
                Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            position: "relative",
                            overflow: "visible",
                            boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -20,
                                left: 20,
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                            }}
                        >
                            <IconifyIcon icon={"guidance:money"} color={"white"} fontSize={30}/>
                            {/*<AttachMoneyIcon fontSize="large" />*/}
                        </Box>
                        <CardContent sx={{pt: 4, pl: 2}}>
                            <Box sx={{textAlign: "right"}}>
                                <Typography variant="h4" component="span">
                                    $24,569
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.success.dark,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        ml: 1,
                                    }}
                                >
                                    {/*<IconifyIcon icon={"guidance:money"} color={"white"} fontSize={30}/>*/}

                                    {/*<ArrowUpwardIcon fontSize="small" /> 12%*/}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Revenue
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            position: "relative",
                            overflow: "visible",
                            boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -20,
                                left: 20,
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                            }}
                        >
                            <IconifyIcon icon={"lets-icons:order-light"} color={"white"} fontSize={30}/>

                            {/*<ShoppingCartIcon fontSize="large" />*/}
                        </Box>
                        <CardContent sx={{pt: 4, pl: 2}}>
                            <Box sx={{textAlign: "right"}}>
                                <Typography variant="h4" component="span">
                                    352
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.success.dark,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        ml: 1,
                                    }}
                                >
                                    {/*<IconifyIcon icon={"lets-icons:order-light"} color={"white"} fontSize={30}/>*/}
                                    {/*<ArrowUpwardIcon fontSize="small" /> 8%*/}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    New Orders
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            position: "relative",
                            overflow: "visible",
                            boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -20,
                                left: 20,
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.palette.warning.light,
                                color: theme.palette.warning.dark,
                                boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                            }}
                        >
                            <IconifyIcon icon={"icon-park-outline:ad-product"} color={"white"} fontSize={30}/>
                            {/*<InventoryIcon fontSize="large" />*/}
                        </Box>
                        <CardContent sx={{pt: 4, pl: 2}}>
                            <Box sx={{textAlign: "right"}}>
                                <Typography variant="h4" component="span">
                                    245
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.error.dark,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        ml: 1,
                                    }}
                                >
                                    {/*<ArrowDownwardIcon fontSize="small" /> 3%*/}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Products
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            position: "relative",
                            overflow: "visible",
                            boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -20,
                                left: 20,
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"
                            }}
                        >
                            <IconifyIcon icon={"radix-icons:person"} color={"white"} fontSize={30}/>
                            {/*<PeopleIcon fontSize="large" />*/}
                        </Box>
                        <CardContent sx={{pt: 4, pl: 2}}>
                            <Box sx={{textAlign: "right"}}>
                                <Typography variant="h4" component="span">
                                    1,254
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.success.dark,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        ml: 1,
                                    }}
                                >
                                    {/*<ArrowUpwardIcon fontSize="small" /> 15%*/}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Customers
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Sales Overview & Order Status */}
            <Grid container spacing={3} sx={{mb: 4}}>
                {/* Sales Overview */}
                <Grid item xs={12} md={8}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                                <Typography variant="h6">Sales Overview</Typography>
                                <Box>
                                    <Button
                                        size="small"
                                        variant={dateRange === "weekly" ? "contained" : "text"}
                                        onClick={() => setDateRange("weekly")}
                                        sx={{mr: 1}}
                                    >
                                        Weekly
                                    </Button>
                                    <Button
                                        size="small"
                                        variant={dateRange === "monthly" ? "contained" : "text"}
                                        onClick={() => setDateRange("monthly")}
                                        sx={{mr: 1}}
                                    >
                                        Monthly
                                    </Button>
                                    <Button
                                        size="small"
                                        variant={dateRange === "yearly" ? "contained" : "text"}
                                        onClick={() => setDateRange("yearly")}
                                    >
                                        Yearly
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{height: 350}}>
                                <Line
                                    data={salesData[dateRange as keyof typeof salesData]}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: theme.palette.divider,
                                                },
                                            },
                                            x: {
                                                grid: {
                                                    color: theme.palette.divider,
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Status */}
                <Grid item xs={12} md={4}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 3}}>
                                Order Status
                            </Typography>
                            <Box sx={{height: 270, display: "flex", justifyContent: "center"}}>
                                <Doughnut
                                    data={ordersChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        cutout: "70%",
                                        plugins: {
                                            legend: {
                                                position: "bottom",
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{mt: 2}}>
                                <Grid container spacing={1}>
                                    {ordersChartData.labels.map((label, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        backgroundColor: ordersChartData.datasets[0].backgroundColor[index],
                                                        mr: 1,
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    {label}: {ordersChartData.datasets[0].data[index]}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Orders & Top Products */}
            <Grid container spacing={3}>
                {/* Recent Orders Table */}
                <Grid item xs={12} md={8}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 3}}>
                                Recent Orders
                            </Typography>
                            <RecentOrdersTable/>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Selling Products */}
                <Grid item xs={12} md={4}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 3}}>
                                Top Selling Products
                            </Typography>
                            <Box>
                                {topProducts.map((product, index) => (
                                    <Box key={index} sx={{mb: 2}}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography variant="body2">{product.name}</Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {product.sales} sold
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={product.percent}
                                            sx={{
                                                height: 5,
                                                borderRadius: 5,
                                                backgroundColor: "rgba(0,0,0,0.1)",
                                                "& .MuiLinearProgress-bar": {
                                                    borderRadius: 5,
                                                    backgroundColor: index === 0 ? theme.palette.primary.main : theme.palette.primary.light,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Additional Charts: User Activity & Product Categories */}
            <Grid container spacing={3} sx={{mt: 2}}>
                {/* User Activity */}
                <Grid item xs={12} md={6}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 3}}>
                                User Activity
                            </Typography>
                            <Box sx={{height: 300}}>
                                <Bar
                                    data={userActivityData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: theme.palette.divider,
                                                },
                                            },
                                            x: {
                                                grid: {
                                                    display: false,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Product Categories */}
                <Grid item xs={12} md={6}>
                    <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 3}}>
                                Product Categories
                            </Typography>
                            <Box sx={{height: 300, display: "flex", justifyContent: "center"}}>
                                <Pie
                                    data={categoryChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "right",
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;