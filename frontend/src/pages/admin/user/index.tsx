import {NextPage} from "next";
import AdminUserPage from "src/views/pages/admin/user";



type TProps = {}

const Index: NextPage<TProps> = () => {
    const handleClose = () => {
        console.log("hihi")
    }
    return (
        <AdminUserPage/>
    )
}
export default Index

