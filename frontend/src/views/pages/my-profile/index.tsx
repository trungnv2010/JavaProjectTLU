import Head from 'next/head'
import {NextPage} from "next";
import CustomTextField from "src/components/text-field";
import {
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    Typography,
    Container,
    Box,
    InputAdornment, IconButton, Avatar, CircularProgress
} from "@mui/material";

import {styled} from '@mui/material/styles';
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from 'yup'
import {EMAIL_REG, PASSWORD_REG} from "src/configs/regex";
import {useEffect, useState} from "react";
import {getAuthMe, updateAuthMe} from "src/services/auth";
import {useRouter} from "next/router";

type TProps = {}

const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
    width: "32vw",
    marginTop: 30
}));

type TDefaultValue = {
    email: string,
    firstName: string,
    phone: string,
    city: string,
    lastName: string
}

const MyProfilePage: NextPage<TProps> = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<TDefaultValue | null>(null)
    const router = useRouter()
    const schema = yup.object()
        .shape({
            email: yup.string().required("The field is required").matches(EMAIL_REG, "The field is must email type"),
            firstName: yup.string().required("The field is required"),
            lastName: yup.string().required("The field is required"),
            phone: yup.string().required("The field is required"),
            city: yup.string().required("The field is required"),
        })
    const {
        handleSubmit,
        control,
        formState: {errors},
        reset
    } = useForm({
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            city:'',
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    })

    const fetchGetAuthMe = async () => {
        setLoading(true)
        await getAuthMe()
            .then(async response => {
                setUser({...response.data})
                setLoading(false)
            })
            .catch(() => {
                setUser(null)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchGetAuthMe()
    }, [])

    // Update form with user data when it's available
    useEffect(() => {
        if (user) {
            reset({
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                city: user.city || ''
            });
        }
    }, [user, reset]);

    const onSubmit = (data: { email: string, firstName: string, lastName: string, phone: string, city: string }) => {
        updateAuthMe(data)
        router.push("/")
    }

    return (
        <>
            {loading ? (
                <Grid container justifyContent="center" sx={{marginTop: 10}}>
                    <CircularProgress />
                </Grid>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'} noValidate>
                    <Grid container spacing={8} justifyContent="center" sx={{marginTop: 5}}>
                        <Avatar sx={{ width: 100, height: 100 }} />
                    </Grid>
                    <Grid container spacing={8} justifyContent="center">
                        <Grid container item md={12} xs={12} justifyContent="center">
                            <Grid item md={5} xs={12}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <CustomTextField
                                            fullWidth
                                            id="email"
                                            label="Email "
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                    name="email"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item md={12} xs={12} justifyContent="center">
                            <Grid item md={5} xs={12}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <CustomTextField
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                    name="firstName"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item md={12} xs={12} justifyContent="center">
                            <Grid item md={5} xs={12}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <CustomTextField
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                    name="lastName"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item md={12} xs={12} justifyContent="center">
                            <Grid item md={5} xs={12}>
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
                            </Grid>
                        </Grid>
                        <Grid container item md={12} xs={12} justifyContent="center">
                            <Grid item md={5} xs={12}>
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
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </SubmitButton>
                    </Grid>
                </form>
            )}
        </>
    )
}

export default MyProfilePage