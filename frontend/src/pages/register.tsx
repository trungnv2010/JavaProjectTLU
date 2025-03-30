import Head from 'next/head'
import {NextPage} from "next";

import RegisterPage from "src/views/pages/register";
import {ReactNode} from "react";
import BlankLayout from "src/views/layouts/BlankLayout";


type TProps = {}

const Register: NextPage<TProps> = () => {
    return (
        <RegisterPage />
    )
}
export default Register
Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true