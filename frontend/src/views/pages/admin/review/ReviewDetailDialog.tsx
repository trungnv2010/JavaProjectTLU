import React, { useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Rating,
    Typography,
    CircularProgress,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/stores";
import { getReviewByIdAsync, deleteReviewAsync } from "src/stores/apps/review";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import IconifyIcon from "src/components/Icon";

interface ReviewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    reviewId: string;
}

const ReviewDetailDialog: React.FC<ReviewDetailDialogProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   reviewId,
                                                               }) => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const { selectedReview, loading, error } = useSelector(
        (state: RootState) => state.review
    );

    useEffect(() => {
        if (open && reviewId) {
            dispatch(getReviewByIdAsync(reviewId));
        }
    }, [dispatch, open, reviewId]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "dd MMMM yyyy, HH:mm");
        } catch (error) {
            return dateString;
        }
    };

    const handleDeleteReview = () => {
        if (!selectedReview) return;

        if (window.confirm("Are you sure you want to delete this review?")) {
            dispatch(
                deleteReviewAsync({
                    id: selectedReview.id!,
                    productId: selectedReview.productId,
                })
            )
                .unwrap()
                .then(() => {
                    toast.success("Review deleted successfully!");
                    onClose();
                })
                .catch((error) => {
                    toast.error(`Failed to delete review: ${error}`);
                });
        }
    };

    const handleViewProduct = () => {
        if (selectedReview?.productId) {
            router.push(`/admin/product/${selectedReview.productId}`);
        }
    };

    const handleViewUser = () => {
        if (selectedReview?.userId) {
            router.push(`/admin/user/${selectedReview.userId}`);
        }
    };

    if (loading.fetchOne) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    if (!selectedReview && !loading.fetchOne) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                        }}
                    >
                        <Typography color="error">
                            {error.fetchOne || "Review not found"}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Review Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <IconButton>
                        <IconifyIcon icon={"material-symbols-light:close-rounded"} />
                    </IconButton>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Product
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {selectedReview?.productName || "N/A"}
                        </Typography>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, mb: 3 }}
                            onClick={handleViewProduct}
                        >
                            View Product
                        </Button>

                        <Typography variant="subtitle2" color="text.secondary">
                            User
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {selectedReview?.userName || "N/A"}
                        </Typography>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, mb: 3 }}
                            onClick={handleViewUser}
                        >
                            View User
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Review Date
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {formatDate(selectedReview?.createdAt)}
                        </Typography>

                        {selectedReview?.updatedAt &&
                            selectedReview?.updatedAt !== selectedReview?.createdAt && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {formatDate(selectedReview?.updatedAt)}
                                    </Typography>
                                </>
                            )}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Rating
                            </Typography>
                            <Rating
                                value={selectedReview?.rating || 0}
                                readOnly
                                size="large"
                            />
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary">
                            Comment
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {selectedReview?.comment || "No comment provided."}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDeleteReview}
                    color="error"
                    disabled={loading.delete}
                >
                    {loading.delete ? <CircularProgress size={24} /> : "Delete Review"}
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewDetailDialog;