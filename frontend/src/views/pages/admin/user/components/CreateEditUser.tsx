import React, { useEffect } from "react";
import {Box, Button, IconButton, styled, Typography, useTheme} from "@mui/material";
import CustomModal from "src/components/custom-modal";
import {Controller, useForm} from "react-hook-form";
import CustomTextField from "src/components/text-field";
import {EMAIL_REG} from "src/configs/regex";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import IconifyIcon from "src/components/Icon";
import {TUserData} from "src/services/user";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/stores";
import {createUserAsync, updateUserAsync} from "src/stores/apps/user";
import toast from "react-hot-toast";

type TCreateEditUser = {
    open: boolean,
    onClose: () => void,
    idUser?: string,
    data?: any
}

const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

const CreateEditUser = (props: TCreateEditUser) => {
    const {open, onClose, idUser, data} = props
    const theme = useTheme()
    const schema = yup.object()
        .shape({
            email: yup.string().required("Email is required").matches(EMAIL_REG, "Must be a valid email"),
            firstname: yup.string().required("First name is required"),
            lastname: yup.string().required("Last name is required"),
            phone: yup.string().required("Phone number is required"),
            city: yup.string().required("City is required"),
        })
    const dispatch: AppDispatch = useDispatch()

    // Get error states from Redux store
    const { error, loading } = useSelector((state: RootState) => state.user);

    const {
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue
    } = useForm({
        defaultValues: {
            email: '',
            firstname: '',
            lastname: '',
            phone: '',
            city: '',
            password: ''
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    })

    // Fill in user information when editing
    useEffect(() => {
        if (idUser && idUser !== "" && data) {
            setValue("email", data.email || "");
            setValue("firstname", data.firstname || "");
            setValue("lastname", data.lastname || "");
            setValue("phone", data.phone || "");
            setValue("city", data.city || "");
        } else {
            reset({
                email: '',
                firstname: '',
                lastname: '',
                phone: '',
                city: '',
                password: ''
            });
        }
    }, [idUser, data, setValue, reset]);

    // Show error messages from Redux state in toast
    useEffect(() => {
        if (error.create) {
            toast.error(`Create user failed: ${error.create}`);
            onClose();
        }
        if (error.update) {
            toast.error(`Update user failed: ${error.update}`);
            onClose();
        }
    }, [error.create, error.update]);

    const onSubmit = async (formData: TUserData) => {
        try {
            if (idUser === "") {
                // Create new user
                await dispatch(createUserAsync({...formData, password: "123456", role: "USER"})).unwrap();
                toast.success("User created successfully!");
                onClose();
            } else {
                // Update user
                await dispatch(updateUserAsync({
                    id: idUser,
                    ...formData
                })).unwrap();
                toast.success("User updated successfully!");
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
                                sx={{fontWeight: '600'}}>{idUser === "" ? "Create New User" : "Update User"}</Typography>
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
                                    id="firstname"
                                    label="First Name"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.firstname}
                                    helperText={errors.firstname?.message}
                                />
                            )}
                            name="firstname"
                        />
                    </Box>

                    <Box sx={{width: "100%", mt: 5}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    fullWidth
                                    id="lastname"
                                    label="Last Name"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.lastname}
                                    helperText={errors.lastname?.message}
                                />
                            )}
                            name="lastname"
                        />
                    </Box>

                    <Box sx={{width: "100%", mt: 5}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                            name="email"
                        />
                    </Box>

                    <Box sx={{width: "100%", mt: 5}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                            name="phone"
                        />
                    </Box>
                    <Box sx={{width: "100%", mt: 5}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    fullWidth
                                    id="city"
                                    label="City"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                />
                            )}
                            name="city"
                        />
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading.create || loading.update}
                        >
                            {idUser === "" ? "Create" : "Save"}
                        </SubmitButton>
                    </Box>
                </form>
            </Box>
        </CustomModal>
    )
}

export default CreateEditUser