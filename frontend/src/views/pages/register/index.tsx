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
    InputAdornment, IconButton
} from "@mui/material";

import {styled} from '@mui/material/styles';
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from 'yup'
import {EMAIL_REG, PASSWORD_REG} from "src/configs/regex";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {registerAuthAsync} from "src/stores/apps/auth/actions";
import {AppDispatch, RootState} from "src/stores";
import {useRouter} from "next/router";
import {ROUTE_CONFIG} from "src/configs/route";

type TProps = {}

// Styled components
const FormContainer = styled('div')(({theme}) => ({
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormComponent = styled('form')(({theme}) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

const RegisterPage: NextPage<TProps> = () => {
    const [showPassword, setShowPassword] = useState(true)
    const [showConfirmPassword, setShowConfirmPassword] = useState(true)

    const dispatch:AppDispatch = useDispatch();
    const {isSuccess} = useSelector((state: RootState) => state.auth)
    const router = useRouter()
    const schema = yup.object()
        .shape({
            email: yup.string().required("The field is required").matches(EMAIL_REG, "The field is must email type"),
            password: yup.string().required("The field is required"),
            confirmPassword: yup.string().required("The field is required").oneOf([yup.ref("password"), ''], "The confirm password is must match with password")
        })
    const {
        handleSubmit,
        control,
        formState: {errors}
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    })


    useEffect(() => {
        if (isSuccess){
            router.push(ROUTE_CONFIG.LOGIN)
        }
    },[isSuccess])

    const onSubmit = (data: { email: string, password: string }) => {
        dispatch(registerAuthAsync({email: data.email, password: data.password}))
    }
    return (
        <Box sx={{
            height: "100vh",
            width: "100vw",
        }}>
            <CssBaseline/>
            <FormContainer>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'} noValidate>
                    <Box sx={{mt: 2}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email "
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    helperText={errors?.email?.message}
                                    error={Boolean(errors?.email)}
                                />
                            )}
                            name="email"
                        />

                    </Box>

                    <Box sx={{mt: 2}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password "
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    helperText={errors?.password?.message}
                                    error={Boolean(errors?.password)}
                                    InputProps={{
                                        style: {WebkitTextSecurity: showPassword ? 'disc' : 'none'},
                                        endAdornment: (
                                            <InputAdornment position={"end"}>
                                                <IconButton edge={"end"} onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path fill="currentColor"
                                                                  d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/>
                                                        </svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path fill="currentColor"
                                                                  d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
                                                        </svg>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            name="password"
                        />

                    </Box>
                    <Box sx={{mt: 2}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <CustomTextField
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password "
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    helperText={errors?.confirmPassword?.message}
                                    error={Boolean(errors?.confirmPassword)}
                                    InputProps={{
                                        style: {WebkitTextSecurity: showConfirmPassword ? 'disc' : 'none'},
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path fill="currentColor"
                                                                  d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/>
                                                        </svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path fill="currentColor"
                                                                  d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
                                                        </svg>
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            name="confirmPassword"
                        />

                    </Box>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <SubmitButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Register
                    </SubmitButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="login" variant="body2">
                                {"You have an account? Login"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </FormContainer>
        </Box>
    )
}

export default RegisterPage