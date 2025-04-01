import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Rating,
    Grid,
    Avatar,
    Button,
    LinearProgress,
    Pagination,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/stores';
import {
    getReviewsByProductIdAsync,
    getProductRatingStatisticsAsync,
    getUserReviewForProductAsync,
} from 'src/stores/apps/review';
import { format } from 'date-fns';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
    productId: number | string;
    userId?: number | string; // Current logged in user ID
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, userId }) => {
    const dispatch: AppDispatch = useDispatch();
    const { data, total, loading, ratingStatistics, userReview } = useSelector(
        (state: RootState) => state.review
    );

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        // Fetch all reviews for the product
        dispatch(
            getReviewsByProductIdAsync({
                productId,
                page,
                limit,
                sortBy: 'createdAt',
                direction: 'desc',
            })
        );

        // Fetch rating statistics
        dispatch(getProductRatingStatisticsAsync(productId));

        // If user is logged in, check if they've already reviewed this product
        if (userId) {
            dispatch(getUserReviewForProductAsync({ userId, productId }))
                .unwrap()
                .catch(() => {
                    // If no review found, that's expected in some cases
                    // Error is already handled in the slice
                });
        }
    }, [dispatch, productId, userId, page, limit]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // MUI Pagination is 1-indexed, our API is 0-indexed
    };

    const handleWriteReview = () => {
        setShowReviewForm(true);
    };

    const handleCloseReviewForm = () => {
        setShowReviewForm(false);
    };

    const handleReviewSubmitted = () => {
        setShowReviewForm(false);

        // Reload reviews and statistics
        dispatch(
            getReviewsByProductIdAsync({
                productId,
                page,
                limit,
                sortBy: 'createdAt',
                direction: 'desc',
            })
        );
        dispatch(getProductRatingStatisticsAsync(productId));

        if (userId) {
            dispatch(getUserReviewForProductAsync({ userId, productId }));
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const renderRatingDistribution = () => {
        if (!ratingStatistics) return null;

        const { ratingDistribution, totalReviews } = ratingStatistics;

        return (
            <Box sx={{ mb: 4 }}>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '40px', mr: 1 }}>
                            <Typography>{rating} ★</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={
                                    totalReviews > 0
                                        ? (ratingDistribution[rating] / totalReviews) * 100
                                        : 0
                                }
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        backgroundColor: '#faaf00',
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{ width: '40px' }}>
                            <Typography variant="body2">
                                {ratingDistribution[rating]}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    };

    const renderReviews = () => {
        if (loading.fetchAll) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (data.length === 0) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No reviews yet. Be the first to review this product!
                    </Typography>
                </Box>
            );
        }

        return data.map((review) => (
            <Box key={review.id} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                    <Avatar
                        sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}
                    >
                        {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1">{review.userName}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {formatDate(review.createdAt || '')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{ ml: 7, mb: 2 }}>
                    {review.comment}
                </Typography>
                <Divider />
            </Box>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Customer Reviews
            </Typography>

            <Grid container spacing={4}>
                {/* Rating Summary */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4">
                                    {ratingStatistics?.averageRating.toFixed(1) || '0.0'}
                                </Typography>
                                <Rating
                                    value={ratingStatistics?.averageRating || 0}
                                    readOnly
                                    precision={0.5}
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {ratingStatistics?.totalReviews || 0} reviews
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {renderRatingDistribution()}

                            {userId && (
                                <Box sx={{ mt: 2 }}>
                                    {userReview ? (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            onClick={handleWriteReview}
                                        >
                                            Edit Your Review
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleWriteReview}
                                        >
                                            Write a Review
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reviews List */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {renderReviews()}

                            {/* Pagination */}
                            {total > limit && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={Math.ceil(total / limit)}
                                        page={page + 1}
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Review Form Dialog */}
            <ReviewForm
                open={showReviewForm}
                onClose={handleCloseReviewForm}
                productId={productId}
                userId={userId}
                existingReview={userReview}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </Box>
    );
};

export default ProductReviews;