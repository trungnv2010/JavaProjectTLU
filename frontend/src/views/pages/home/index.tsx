import {NextPage} from "next";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    Button,
    Rating,
    Badge,
    Chip,
    Container,
    IconButton,
    TextField,
    InputAdornment,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
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
import {useEffect, useState} from "react";
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

const PhoneStorePage: NextPage<TProps> = () => {
    const theme = useTheme();
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // Featured products data
    const featuredPhones = [
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            image: "data:image/jpeg;base64,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",
            price: 1299,
            oldPrice: 1399,
            rating: 4.8,
            reviewCount: 256,
            isNew: true,
            discount: 10,
        },
        {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            image: "/images/samsung-s24.jpg",
            price: 1199,
            oldPrice: 1299,
            rating: 4.7,
            reviewCount: 189,
            isNew: true,
            discount: 8,
        },
        {
            id: 3,
            name: "Google Pixel 8 Pro",
            image: "/images/pixel8.jpg",
            price: 999,
            oldPrice: 1099,
            rating: 4.6,
            reviewCount: 134,
            isNew: false,
            discount: 9,
        },
        {
            id: 4,
            name: "Xiaomi 14 Ultra",
            image: "/images/xiaomi14.jpg",
            price: 899,
            oldPrice: 999,
            rating: 4.5,
            reviewCount: 112,
            isNew: false,
            discount: 10,
        },
    ];

    // Popular categories
    const categories = [
        {name: "Flagship", count: 24},
        {name: "Mid-Range", count: 36},
        {name: "Budget", count: 18},
        {name: "Foldable", count: 8},
        {name: "Gaming", count: 12},
    ];

    // Best selling phones
    const bestSellers = [
        {name: "iPhone 14", sales: 1250, percent: 100},
        {name: "Samsung Galaxy A54", sales: 980, percent: 78},
        {name: "Xiaomi Redmi Note 12", sales: 850, percent: 68},
        {name: "Google Pixel 7a", sales: 720, percent: 58},
        {name: "Nothing Phone 2", sales: 650, percent: 52},
    ];

    // Brands
    const brands = [
        "Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Nothing", "OPPO", "Vivo"
    ];

    // Latest deals
    const latestDeals = [
        {
            id: 5,
            name: "OnePlus 12",
            image: "/images/oneplus12.jpg",
            price: 799,
            oldPrice: 899,
            discount: 15,
        },
        {
            id: 6,
            name: "iPhone 14 Pro",
            image: "/images/iphone14pro.jpg",
            price: 899,
            oldPrice: 999,
            discount: 10,
        },
        {
            id: 7,
            name: "Samsung Galaxy Z Flip5",
            image: "/images/zflip5.jpg",
            price: 849,
            oldPrice: 999,
            discount: 15,
        },
    ];

    // Cart items
    const [cartItems, setCartItems] = useState([
        {id: 1, name: "iPhone 15 Pro", quantity: 1, price: 999},
        {id: 3, name: "Google Pixel 8", quantity: 1, price: 699},
    ]);

    const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCategoryMenuAnchor(event.currentTarget);
    };

    const handleCategoryMenuClose = () => {
        setCategoryMenuAnchor(null);
    };

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <Box>
            {/* Header */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h5" color="primary" sx={{flexGrow: 0, mr: 2, fontWeight: 'bold'}}>
                        PhoneStore
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={handleCategoryMenuOpen}
                        sx={{mr: 2}}
                    >
                        Danh mục
                    </Button>
                    <Menu
                        anchorEl={categoryMenuAnchor}
                        open={Boolean(categoryMenuAnchor)}
                        onClose={handleCategoryMenuClose}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.name} onClick={handleCategoryMenuClose}>
                                {category.name} ({category.count})
                            </MenuItem>
                        ))}
                    </Menu>

                    <Button color="inherit" sx={{mr: 2}}>Khuyến mãi</Button>
                    <Button color="inherit" sx={{mr: 2}}>Đánh giá</Button>
                    <Button color="inherit" sx={{mr: 2}}>Phụ kiện</Button>

                    <TextField
                        size="small"
                        placeholder="Tìm kiếm điện thoại..."
                        variant="outlined"
                        value={searchValue}
                        onChange={handleSearchChange}
                        sx={{
                            flexGrow: 1,
                            mx: 2,
                            backgroundColor: 'white',
                            borderRadius: 1,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconifyIcon icon="eva:search-fill"/>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <IconButton color="inherit" onClick={toggleCart}>
                        <Badge badgeContent={cartItems.length} color="primary">
                            <IconifyIcon icon="eva:shopping-cart-fill"/>
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit" sx={{ml: 1}}>
                        <IconifyIcon icon="eva:person-fill"/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Cart Drawer */}
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={toggleCart}
            >
                <Box sx={{width: 320, p: 2}}>
                    <Typography variant="h6" sx={{mb: 2}}>Giỏ hàng của bạn</Typography>
                    <Divider/>

                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item.id} sx={{py: 2}}>
                                <Box sx={{width: '100%'}}>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant="body1">{item.name}</Typography>
                                        <Typography variant="body1" fontWeight="bold">${item.price}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                                        <Button size="small" variant="outlined" sx={{minWidth: 0, p: 0.5}}>-</Button>
                                        <Typography sx={{mx: 1}}>{item.quantity}</Typography>
                                        <Button size="small" variant="outlined" sx={{minWidth: 0, p: 0.5}}>+</Button>
                                        <IconButton size="small" color="error" sx={{ml: 'auto'}}>
                                            <IconifyIcon icon="eva:trash-2-outline" fontSize={20}/>
                                        </IconButton>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{my: 2}}/>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                        <Typography variant="body1">Tổng cộng:</Typography>
                        <Typography
                            variant="h6">${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</Typography>
                    </Box>

                    <Button variant="contained" fullWidth color="primary" sx={{mb: 2}}>
                        Thanh toán
                    </Button>
                    <Button variant="outlined" fullWidth onClick={toggleCart}>
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            </Drawer>

            <Container maxWidth="xl">
                {/* Hero Banner */}
                <Box
                    sx={{
                        mt: 4,
                        mb: 6,
                        height: 400,
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundImage: 'url(/images/phone-banner.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            p: 6,
                            maxWidth: 500,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            ml: 8,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                            iPhone 15 Pro
                        </Typography>
                        <Typography variant="h6" sx={{mb: 3}}>
                            Titanium. Mạnh mẽ. Pro Camera. A17 Pro.
                        </Typography>
                        <Typography variant="h4" color="primary" fontWeight="bold" sx={{mb: 3}}>
                            Giá chỉ từ $999
                        </Typography>
                        <Button variant="contained" size="large" color="primary" sx={{mr: 2}}>
                            Mua ngay
                        </Button>
                        <Button variant="outlined" size="large">
                            Tìm hiểu thêm
                        </Button>
                    </Box>
                </Box>

                {/* Categories */}
                <Box sx={{mb: 6}}>
                    <Typography variant="h5" sx={{mb: 3}}>
                        Danh mục phổ biến
                    </Typography>
                    <Grid container spacing={2}>
                        {categories.map((category) => (
                            <Grid item xs={6} sm={4} md={2.4} key={category.name}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)",
                                        textAlign: 'center',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: "0 4px 20px 0 rgba(32, 40, 45, 0.16)",
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                mb: 2,
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                backgroundColor: theme.palette.primary.light,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <IconifyIcon icon="ph:device-mobile-bold" fontSize={30}/>
                                        </Box>
                                        <Typography variant="h6" component="h3">
                                            {category.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {category.count} sản phẩm
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Featured Products */}
                <Box sx={{mb: 6}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant="h5">Sản phẩm nổi bật</Typography>
                        <Button color="primary">Xem tất cả</Button>
                    </Box>
                    <Grid container spacing={3}>
                        {featuredPhones.map((phone) => (
                            <Grid item xs={12} sm={6} md={3} key={phone.id}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)",
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: "0 4px 20px 0 rgba(32, 40, 45, 0.16)",
                                        }
                                    }}
                                >
                                    {phone.isNew && (
                                        <Chip
                                            label="New"
                                            color="primary"
                                            size="small"
                                            sx={{position: 'absolute', top: 10, left: 10, zIndex: 1}}
                                        />
                                    )}
                                    {phone.discount > 0 && (
                                        <Chip
                                            label={`-${phone.discount}%`}
                                            color="error"
                                            size="small"
                                            sx={{position: 'absolute', top: 10, right: 10, zIndex: 1}}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            height: 200,
                                            backgroundColor: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 2,
                                            borderRadius: '8px 8px 0 0',
                                        }}
                                    >
                                        <Box component="img" src="/api/placeholder/200/200" alt={phone.name}
                                             sx={{maxHeight: '100%', maxWidth: '100%'}}/>
                                    </Box>
                                    <CardContent sx={{flexGrow: 1}}>
                                        <Typography variant="h6" component="h3" sx={{mb: 1}}>
                                            {phone.name}
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                            <Rating value={phone.rating} precision={0.1} size="small" readOnly/>
                                            <Typography variant="body2" sx={{ml: 1}}>
                                                ({phone.reviewCount})
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: 'flex', alignItems: 'baseline', mb: 2}}>
                                            <Typography variant="h6" color="primary" fontWeight="bold" sx={{mr: 1}}>
                                                ${phone.price}
                                            </Typography>
                                            {phone.oldPrice && (
                                                <Typography variant="body2" color="text.secondary"
                                                            sx={{textDecoration: 'line-through'}}>
                                                    ${phone.oldPrice}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button variant="contained" fullWidth>
                                            Thêm vào giỏ
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Latest Deals & Best Sellers */}
                <Grid container spacing={3} sx={{mb: 6}}>
                    {/* Latest Deals */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)"}}>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h5">Khuyến mãi mới nhất</Typography>
                                    <Button color="primary">Xem tất cả</Button>
                                </Box>
                                <Grid container spacing={2}>
                                    {latestDeals.map((deal) => (
                                        <Grid item xs={12} sm={4} key={deal.id}>
                                            <Card
                                                sx={{
                                                    boxShadow: 'none',
                                                    border: '1px solid',
                                                    borderColor: theme.palette.divider,
                                                    borderRadius: 2,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Chip
                                                    label={`-${deal.discount}%`}
                                                    color="error"
                                                    size="small"
                                                    sx={{position: 'absolute', top: 10, right: 10, zIndex: 1}}
                                                />
                                                <Box sx={{p: 2, textAlign: 'center'}}>
                                                    <Box component="img" src="/api/placeholder/150/150" alt={deal.name}
                                                         sx={{maxHeight: 120, maxWidth: '100%', mb: 2}}/>
                                                    <Typography variant="h6" component="h3" sx={{mb: 1}}>
                                                        {deal.name}
                                                    </Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'baseline',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Typography variant="h6" color="error" fontWeight="bold"
                                                                    sx={{mr: 1}}>
                                                            ${deal.price}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary"
                                                                    sx={{textDecoration: 'line-through'}}>
                                                            ${deal.oldPrice}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Best Sellers */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{borderRadius: 2, boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)", height: '100%'}}>
                            <CardContent>
                                <Typography variant="h5" sx={{mb: 3}}>
                                    Bán chạy nhất
                                </Typography>
                                <Box>
                                    {bestSellers.map((product, index) => (
                                        <Box key={index} sx={{mb: 3}}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    mb: 0.5,
                                                }}
                                            >
                                                <Typography variant="body1">{product.name}</Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {product.sales} đã bán
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    height: 5,
                                                    borderRadius: 5,
                                                    backgroundColor: "rgba(0,0,0,0.1)",
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        height: '100%',
                                                        width: `${product.percent}%`,
                                                        borderRadius: 5,
                                                        backgroundColor: index === 0 ? theme.palette.primary.main : theme.palette.primary.light,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Brands */}
                <Box sx={{mb: 6}}>
                    <Typography variant="h5" sx={{mb: 3}}>
                        Thương hiệu nổi tiếng
                    </Typography>
                    <Grid container spacing={2}>
                        {brands.map((brand) => (
                            <Grid item xs={6} sm={3} md={1.5} key={brand}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: "0 2px 10px 0 rgba(32, 40, 45, 0.08)",
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: "0 4px 20px 0 rgba(32, 40, 45, 0.16)",
                                        }
                                    }}
                                >
                                    <CardContent sx={{p: 2}}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: 80,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h6">{brand}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Subscribe Section */}
                <Card
                    sx={{
                        mb: 6,
                        borderRadius: 2,
                        boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.08)",
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    <CardContent sx={{py: 4}}>
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item xs={12} md={7}>
                                <Typography variant="h5" gutterBottom>
                                    Đăng ký nhận tin khuyến mãi
                                </Typography>
                                <Typography variant="body1">
                                    Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt qua email.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box sx={{display: 'flex'}}>
                                    <TextField
                                        fullWidth
                                        placeholder="Nhập email của bạn"
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '4px 0 0 4px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRight: 'none',
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: '0 4px 4px 0',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>

            {/* Footer */}
            <Box sx={{bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider'}}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                PhoneStore
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Chuyên cung cấp các sản phẩm điện thoại chính hãng, chất lượng cao với giá tốt nhất thị
                                trường.
                            </Typography>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <IconButton size="small" sx={{bgcolor: '#f0f0f0'}}>
                                    <IconifyIcon icon="eva:facebook-fill"/>
                                </IconButton>
                                <IconButton size="small" sx={{bgcolor: '#f0f0f0'}}>
                                    <IconifyIcon icon="eva:twitter-fill"/>
                                </IconButton>
                                <IconButton size="small" sx={{bgcolor: '#f0f0f0'}}>
                                    <IconifyIcon icon="eva:instagram-fill"/>
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Liên kết nhanh
                            </Typography>
                            <List dense disablePadding>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Về chúng tôi"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Sản phẩm"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Khuyến mãi"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Tin tức & Blog"/>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Liên hệ"/>
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin liên hệ
                            </Typography>
                            <List dense disablePadding>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconifyIcon icon="eva:pin-outline" sx={{mr: 1}}/>
                                                <Typography variant="body2">123 Đường Nguyễn Du, Q.1,
                                                    TP.HCM</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconifyIcon icon="eva:phone-outline" sx={{mr: 1}}/>
                                                <Typography variant="body2">(+84) 28 1234 5678</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconifyIcon icon="eva:email-outline" sx={{mr: 1}}/>
                                                <Typography variant="body2">info@phonestore.com</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Hỗ trợ khách hàng
                            </Typography>
                            <List dense disablePadding>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Hướng dẫn mua hàng"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Chính sách đổi trả"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Chính sách bảo hành"/>
                                </ListItem>
                                <ListItem disablePadding sx={{pb: 0.5}}>
                                    <ListItemText primary="Thanh toán & Vận chuyển"/>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Câu hỏi thường gặp"/>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>

                    <Divider sx={{my: 3}}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        <Typography variant="body2" color="text.secondary">
                            © 2025 PhoneStore. Tất cả các quyền được bảo lưu.
                        </Typography>
                        <Box>
                            <Button color="inherit" size="small" sx={{textTransform: 'none'}}>
                                Điều khoản sử dụng
                            </Button>
                            <Button color="inherit" size="small" sx={{textTransform: 'none'}}>
                                Chính sách bảo mật
                            </Button>
                            <Button color="inherit" size="small" sx={{textTransform: 'none'}}>
                                Phương thức thanh toán
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PhoneStorePage;