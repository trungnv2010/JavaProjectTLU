import {NextPage} from "next";
import MyProfilePage from "src/views/pages/my-profile";
import {ReactNode} from "react";
import LayoutNotApp from "src/views/layouts/LayoutNotApp";
import Home from "src/pages/index";


type TProps = {}

const MyProfile: NextPage<TProps> = () => {
    return (
        <MyProfilePage/>
    )
}
export default MyProfile
MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
MyProfile.authGuard = true

