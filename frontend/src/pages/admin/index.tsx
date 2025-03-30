import {NextPage} from "next";
import MyProfilePage from "src/views/pages/my-profile";
import {ReactNode} from "react";

import UserLayout from "src/views/layouts/UserLayout";


type TProps = {}

const Admin: NextPage<TProps> = () => {
    return (
        <MyProfilePage/>
    )
}
export default Admin
Admin.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
Admin.authGuard = true

