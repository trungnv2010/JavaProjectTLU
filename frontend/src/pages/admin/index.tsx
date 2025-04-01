import {NextPage} from "next";
import MyProfilePage from "src/views/pages/my-profile";
import {ReactNode} from "react";

import UserLayout from "src/views/layouts/UserLayout";
import AdminDashboard from "src/views/pages/admin";


type TProps = {}

const Admin: NextPage<TProps> = () => {
    return (
     <AdminDashboard />
    )
}
export default Admin
Admin.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
Admin.authGuard = true

