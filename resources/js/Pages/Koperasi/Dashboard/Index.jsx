import UsersLayout from "@/Layouts/UsersLayout";

export default function Index({auth}){
    return(
        <UsersLayout auth={auth}>
            <h1>Test</h1>
        </UsersLayout>
    )
}
