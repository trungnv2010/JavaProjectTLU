import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Rating,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/stores';
import {
    createReviewAsync,
    updateReviewAsync,
    deleteReviewAsync,
} from 'src/stores/apps/review';
import { TRating, TReviewData } from 'src/services/review';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    open: boolean;
    onClose: () => void;
    productId: number | string;
    userId?: number | string;
    existingReview: TReviewData | null;
    onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
                                                   open,
                                                   onClose,
                                                   productId,
                                                   userId,
                                                   existingReview,
                                                   onReviewSubmitted,
                                               }) => {
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.review);

    const [rating, setRating] = useState<TRating>((existingReview?.rating as TRating) || 5);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [hoverRating, setHoverRating] = useState(-1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSubmit = () => {
        if (!userId) {
            toast.error('You must be logged in to submit a review.');
            return;
        }

        if (rating < 1) {
            toast.error('Please select a rating.');
            return;
        }

        if (existingReview) {
            // Update existing review
            dispatch(
                updateReviewAsync({
                    id: existingReview.id!,
                    data: {
                        rating,
                        comment,
                    },
                    productId,
                })
            )
                .unwrap()
                .then(() => {
                    toast.success('Your review has been updated!');
                    onReviewSubmitted();
                })
                .catch((error) => {
                    toast.error(`Failed to update review: ${error}`);
                });
        } else {
            // Create new review
            dispatch(
                createReviewAsync({
                    productId,
                    userId,
                    rating,
                    comment,
                })
            )
                .unwrap()
                .then(() => {
                    toast.success('Your review has been submitted!');
                    onReviewSubmitted();
                })
                .catch((error) => {
                    toast.error(`Failed to submit review: ${error}`);
                });
        }
    };

    const handleDelete = () => {
        if (!existingReview || !existingReview.id) return;

        dispatch(
            deleteReviewAsync({
                id: existingReview.id,
                productId,
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Your review has been deleted!');
                setShowDeleteConfirm(false);
                onReviewSubmitted();
            })
            .catch((error) => {
                toast.error(`Failed to delete review: ${error}`);
            });
    };

    const ratingLabels: { [index: string]: string } = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent',
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="review-form-dialog-title"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="review-form-dialog-title">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ my: 2 }}>
                    <Typography component="legend" gutterBottom>
                        Your Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                            name="product-rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue as TRating);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHoverRating(newHover);
                            }}
                            size="large"
                        />
                        {rating !== null && (
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body2">
                                    {ratingLabels[hoverRating !== -1 ? hoverRating : rating]}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box sx={{ my: 3 }}>
                    <TextField
                        label="Your Review (optional)"
                        multiline
                        rows={6}
                        fullWidth
                        variant="outlined"
                        placeholder="Share your experience with this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                {existingReview && (
                    <Button
                        onClick={() => setShowDeleteConfirm(true)}
                        color="error"
                        disabled={loading.delete}
                    >
                        Delete
                    </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading.create || loading.update}
                >
                    {loading.create || loading.update ? (
                        <CircularProgress size={24} />
                    ) : existingReview ? (
                        'Update Review'
                    ) : (
                        'Submit Review'
                    )}
                </Button>
            </DialogActions>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete your review? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeleteConfirm(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading.delete}
                    >
                        {loading.delete ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default ReviewForm;