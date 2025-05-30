function Navbar() {
    return <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
        <img rel="icon" src="/coin-svgrepo-com (2).svg" width="40"/>
        <a className="navbar-brand">FarCoin</a>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
            <li className="nav-item">
            <a className="nav-link" href="/home">Home</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/chain">Blockchain</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/transact">Transact</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/wallet">Wallet</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/mine">Mine</a>
            </li>
        </ul>
        </div>
    </div>
    </nav>
}

export default Navbar;