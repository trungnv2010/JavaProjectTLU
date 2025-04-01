import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    styled,
    Typography,
    useTheme
} from "@mui/material";
import CustomModal from "src/components/custom-modal";
import {Controller, useForm} from "react-hook-form";
import CustomTextField from "src/components/text-field";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import IconifyIcon from "src/components/Icon";
import {TProductData} from "src/services/product";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/stores";
import {createProductAsync, updateProductAsync} from "src/stores/apps/product";
import {getAllCategoriesAsync} from "src/stores/apps/category";
import toast from "react-hot-toast";

type TCreateEditProduct = {
    open: boolean,
    onClose: () => void,
    idProduct?: string,
    data?: any
}

const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

const ImagePreview = styled(Box)(({theme}) => ({
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    border: `1px dashed ${theme.palette.divider}`
}));

const CreateEditProduct = (props: TCreateEditProduct) => {
    const {open, onClose, idProduct, data} = props
    const theme = useTheme()
    const dispatch: AppDispatch = useDispatch()
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { error, loading } = useSelector((state: RootState) => state.product);
    const { allData: categories } = useSelector((state: RootState) => state.category);

    const schema = yup.object().shape({
        name: yup.string().required("Product name is required"),
        description: yup.string().required("Description is required"),
        price: yup.number()
            .required("Price is required")
            .positive("Price must be positive")
            .typeError("Price must be a number"),
        discountPrice: yup.number()
            .nullable()
            .transform((value) => (isNaN(value) || value === 0 ? null : value))
            .min(0, "Discount price cannot be negative")
            .test('less-than-price', 'Discount must be less than price', function(value) {
                const { price } = this.parent;
                return !value || value < price;
            }),
        stockQuantity: yup.number()
            .required("Stock quantity is required")
            .min(0, "Stock cannot be negative")
            .integer("Stock must be an integer")
            .typeError("Stock must be a number"),
        imageUrl: yup.string().nullable(),
        brand: yup.string().nullable(),
        model: yup.string().nullable(),
        specifications: yup.string().nullable(),
        categoryId: yup.string().required("Category is required")
    });

    const {
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            discountPrice: 0,
            stockQuantity: 0,
            imageUrl: '',
            brand: '',
            model: '',
            specifications: '{}',
            categoryId: ''
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    });

    const watchImageUrl = watch("imageUrl");

    useEffect(() => {
        dispatch(getAllCategoriesAsync({limit: 0, page: 0, search: ""}));
    }, []);

    console.log("category", categories)

    useEffect(() => {
        if (watchImageUrl) {
            setImagePreview(watchImageUrl);
        }
    }, [watchImageUrl]);

    useEffect(() => {
        if (idProduct && idProduct !== "" && data) {
            setValue("name", data.name || "");
            setValue("description", data.description || "");
            setValue("price", data.price || 0);
            setValue("discountPrice", data.discountPrice || 0);
            setValue("stockQuantity", data.stockQuantity || 0);
            setValue("imageUrl", data.imageUrl || "");
            setValue("brand", data.brand || "");
            setValue("model", data.model || "");
            setValue("specifications", data.specifications || "");
            setValue("categoryId", data.categoryId || "");

            if (data.imageUrl) {
                setImagePreview(data.imageUrl);
            }
        } else {
            reset({
                name: '',
                description: '',
                price: 0,
                discountPrice: 0,
                stockQuantity: 0,
                imageUrl: '',
                brand: '',
                model: '',
                specifications: '',
                categoryId: ''
            });
            setImagePreview(null);
        }
    }, [idProduct, data, setValue, reset]);

    useEffect(() => {
        if (error.create) {
            toast.error(`Create product failed: ${error.create}`);
        }
        if (error.update) {
            toast.error(`Update product failed: ${error.update}`);
        }
    }, [error.create, error.update]);

    const onSubmit = async (formData: TProductData) => {
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
                stockQuantity: Number(formData.stockQuantity)
            };

            if (idProduct === "") {
                await dispatch(createProductAsync(productData)).unwrap();
                toast.success("Product created successfully!");
                onClose();
            } else {
                await dispatch(updateProductAsync({
                    ...productData,
                    id: idProduct
                })).unwrap();
                toast.success("Product updated successfully!");
                onClose();
            }
        } catch (error: any) {
            console.error("Form submission error:", error);
        }
    }

    return (
        <CustomModal onClose={onClose} open={open}>
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '20px',
                borderRadius: '15px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}
                 minWidth={{md: '600px'}}>
                <Box sx={{display: "flex", justifyContent: "center", position: 'relative', paddingBottom: '20px'}}>
                    <Typography variant={'h3'}
                                sx={{fontWeight: '600'}}>{idProduct === "" ? "Create New Product" : "Update Product"}</Typography>
                    <IconButton sx={{position: 'absolute', top: '-6px', right: '-10px'}} onClick={onClose}>
                        <IconifyIcon icon={"ic:baseline-close"} fontSize={30}/>
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>Basic Information</Typography>
                            <Divider sx={{mb: 2}} />

                            <Controller
                                control={control}
                                rules={{required: true}}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <CustomTextField
                                        fullWidth
                                        id="name"
                                        label="Product Name"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        sx={{mb: 3}}
                                    />
                                )}
                                name="name"
                            />

                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <CustomTextField
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        multiline
                                        rows={4}
                                        sx={{mb: 3}}
                                    />
                                )}
                                name="description"
                            />

                            <Controller
                                control={control}
                                name="categoryId"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.categoryId} sx={{mb: 3}}>
                                        <InputLabel id="category-select-label">Category</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            label="Category"
                                            {...field}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.categoryId && (
                                            <FormHelperText>{errors.categoryId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>Pricing & Inventory</Typography>
                            <Divider sx={{mb: 2}} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="price"
                                                label="Price"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.price}
                                                helperText={errors.price?.message}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                            />
                                        )}
                                        name="price"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="discountPrice"
                                                label="Discount Price (optional)"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.discountPrice}
                                                helperText={errors.discountPrice?.message}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                            />
                                        )}
                                        name="discountPrice"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        rules={{ required: true }}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="stockQuantity"
                                                label="Stock Quantity"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.stockQuantity}
                                                helperText={errors.stockQuantity?.message}
                                                type="number"
                                                sx={{mt: 2}}
                                            />
                                        )}
                                        name="stockQuantity"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>Additional Details</Typography>
                            <Divider sx={{mb: 2}} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="brand"
                                                label="Brand (optional)"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.brand}
                                                helperText={errors.brand?.message}
                                            />
                                        )}
                                        name="brand"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="model"
                                                label="Model (optional)"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.model}
                                                helperText={errors.model?.message}
                                            />
                                        )}
                                        name="model"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <CustomTextField
                                                fullWidth
                                                id="specifications"
                                                label="Specifications (JSON format, optional)"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                error={!!errors.specifications}
                                                helperText={errors.specifications?.message}
                                                multiline
                                                rows={3}
                                                sx={{mt: 2}}
                                            />
                                        )}
                                        name="specifications"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>Product Image</Typography>
                            <Divider sx={{mb: 2}} />

                            <ImagePreview>
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Product Preview"
                                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                                    />
                                ) : (
                                    <Box sx={{textAlign: 'center', padding: 2}}>
                                        <IconifyIcon icon="mdi:image-outline" fontSize={40} />
                                        <Typography variant="body2" sx={{mt: 1}}>
                                            No image preview
                                        </Typography>
                                    </Box>
                                )}
                            </ImagePreview>

                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <CustomTextField
                                        fullWidth
                                        id="imageUrl"
                                        label="Image URL (optional)"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={!!errors.imageUrl}
                                        helperText={errors.imageUrl?.message}
                                    />
                                )}
                                name="imageUrl"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 4}}>
                        <SubmitButton
                            onClick={onClose}
                            variant="outlined"
                            sx={{mr: 2}}
                        >
                            Cancel
                        </SubmitButton>
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading.create || loading.update}
                        >
                            {idProduct === "" ? "Create Product" : "Save Changes"}
                        </SubmitButton>
                    </Box>
                </form>
            </Box>
        </CustomModal>
    )
}

export default CreateEditProduct