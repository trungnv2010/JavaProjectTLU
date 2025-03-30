import React from "react";
import {Box, Button, IconButton, styled, Typography, useTheme} from "@mui/material";
import CustomModal from "src/components/custom-modal";
import {Controller, useForm} from "react-hook-form";
import CustomTextField from "src/components/text-field";
import {EMAIL_REG} from "src/configs/regex";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import IconifyIcon from "src/components/Icon";
import {createNewUser, TUserData, updateUser} from "src/services/user";
import {useDispatch} from "react-redux";
import {AppDispatch} from "src/stores";
import {createUserAsync} from "src/stores/apps/user";


type TCreateEditUser = {
    open: boolean,
    onClose: () => void,
    idUser?: string
}
const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));


const CreateEditUser = (props: TCreateEditUser) => {
    const {open, onClose, idUser} = props
    const theme = useTheme()
    const schema = yup.object()
        .shape({
            email: yup.string().required("The field is required").matches(EMAIL_REG, "The field is must email type"),
        })
    const dispatch:AppDispatch = useDispatch()
    const {
        handleSubmit,
        control,
        formState: {errors}
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: TUserData) => {
        if (idUser === ""){
            dispatch(createUserAsync( {...data,password: "123456", role: "USER"}));
            onClose();
        } else {

        }
    }

    return (
        <CustomModal onClose={onClose} open={open}>
            <Box sx={{backgroundColor: theme.palette.background.paper, padding: '20px', borderRadius: '15px'}}
                 minWidth={{md: '400px'}}>
                <Box sx={{display: "flex", justifyContent: "center", position: 'relative', paddingBottom: '20px'}}>
                    <Typography variant={'h3'}
                                sx={{fontWeight: '600'}}>{idUser === "" ? "Create new user" : "Update user"}</Typography>
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
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
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
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
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
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
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
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
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