import Login from './Login'

const Logout = () => {
    localStorage.clear()
    return (
        <Login />
    )
}

export default Logout