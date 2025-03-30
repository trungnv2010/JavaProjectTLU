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
import {useState} from "react";
import {useAuth} from "src/hooks/useAuth";

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

const LoginPage: NextPage<TProps> = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isRemember, setIsRemember] = useState(true)
    const {login} = useAuth()
    const schema = yup.object()
        .shape({
            email: yup.string().required("The field is required").matches(EMAIL_REG, "The field is must email type"),
            password: yup.string().required("The field is required")
        })
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

    const onSubmit = (data: { email: string, password: string }) => {
        login({...data, rememberMe: isRemember})
    }

    return (
        <Box sx={{
            height: "100vh",
            width: "100vw",
        }}>
            <CssBaseline/>
            <FormContainer>
                <Typography component="h1" variant="h5">
                    Sign in
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
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
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
                        Sign In
                    </SubmitButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </FormContainer>
        </Box>
    )
}

export default LoginPage