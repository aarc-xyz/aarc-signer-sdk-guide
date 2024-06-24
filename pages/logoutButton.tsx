export const LogoutButton = () => {
    const handleLogout = () => {
        localStorage.removeItem('sessionKey');
        localStorage.removeItem('walletAddress');
        window.location.reload();
    }

    return (
        <button onClick={handleLogout} style={{margin: '10px'}}>
            Logout
        </button>
    )
}