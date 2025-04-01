import React, { useEffect } from "react";
import {Box, Button, IconButton, styled, Typography, useTheme} from "@mui/material";
import CustomModal from "src/components/custom-modal";
import {Controller, useForm} from "react-hook-form";
import CustomTextField from "src/components/text-field";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import IconifyIcon from "src/components/Icon";
import {TCategoryData} from "src/services/category";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/stores";
import {createCategoryAsync, updateCategoryAsync} from "src/stores/apps/category";
import toast from "react-hot-toast";

type TCreateEditCategory = {
    open: boolean,
    onClose: () => void,
    idCategory?: string,
    data?: any
}

const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

const CreateEditCategory = (props: TCreateEditCategory) => {
    const {open, onClose, idCategory, data} = props
    const theme = useTheme()
    const schema = yup.object()
        .shape({
            name: yup.string().required("Name is required"),
            description: yup.string()
        })
    const dispatch: AppDispatch = useDispatch()

    // Get error states from Redux store
    const { error, loading } = useSelector((state: RootState) => state.category);

    const {
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue
    } = useForm({
        defaultValues: {
            name: '',
            description: ''
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    })

    // Fill in category information when editing
    useEffect(() => {
        if (idCategory && idCategory !== "" && data) {
            setValue("name", data.name || "");
            setValue("description", data.description || "");
        } else {
            reset({
                name: '',
                description: ''
            });
        }
    }, [idCategory, data, setValue, reset]);

    // Show error messages from Redux state in toast
    useEffect(() => {
        if (error.create) {
            toast.error(`Create category failed: ${error.create}`);
            onClose();
        }
        if (error.update) {
            toast.error(`Update category failed: ${error.update}`);
            onClose();
        }
    }, [error.create, error.update]);

    const onSubmit = async (formData: TCategoryData) => {
        try {
            if (idCategory === "") {
                // Create new category
                await dispatch(createCategoryAsync({
                    name: formData.name,
                    description: formData.description || ""
                })).unwrap();
                toast.success("Category created successfully!");
                onClose();
            } else {
                // Update category
                await dispatch(updateCategoryAsync({
                    id: idCategory,
                    name: formData.name,
                    description: formData.description || ""
                })).unwrap();
                toast.success("Category updated successfully!");
                onClose();
            }
        } catch (error: any) {
            console.error("Form submission error:", error);
        }
    }

    return (
        <CustomModal onClose={onClose} open={open}>
            <Box sx={{backgroundColor: theme.palette.background.paper, padding: '20px', borderRadius: '15px'}}
                 minWidth={{md: '400px'}}>
                <Box sx={{display: "flex", justifyContent: "center", position: 'relative', paddingBottom: '20px'}}>
                    <Typography variant={'h3'}
                                sx={{fontWeight: '600'}}>{idCategory === "" ? "Create New Category" : "Update Category"}</Typography>
                    <IconButton sx={{position: 'absolute', top: '-6px', right: '-10px'}} onClick={onClose}>
                        <IconifyIcon icon={"ic:baseline-close"} fontSize={30}/>
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'} noValidate>
                    <Box sx={{width: "100%"}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    fullWidth
                                    id="name"
                                    label="Category Name"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                            name="name"
                        />
                    </Box>

                    {/* Display slug as read-only when editing */}
                    {idCategory && idCategory !== "" && data && (
                        <Box sx={{width: "100%", mt: 5}}>
                            <CustomTextField
                                fullWidth
                                id="slug"
                                label="Slug"
                                value={data.slug || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                helperText="Slug is automatically generated from the name"
                            />
                        </Box>
                    )}

                    <Box sx={{width: "100%", mt: 5}}>
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
                                />
                            )}
                            name="description"
                        />
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading.create || loading.update}
                        >
                            {idCategory === "" ? "Create" : "Save"}
                        </SubmitButton>
                    </Box>
                </form>
            </Box>
        </CustomModal>
    )
}

export default CreateEditCategory