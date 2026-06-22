import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileInfo from './ProfileInfo'
import SearchBar from './SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        // console.log(`iam working`);
        localStorage.clear();
        navigate("/login");
    }

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    }

    return (
        <div className="bg-white flex flex-col px-4 sm:px-6 py-3 drop-shadow gap-3">
            <div className="w-full flex items-center justify-between gap-3">
                <h2 className="text-xl font-medium text-black py-2">
                    <Link to="/">Notes</Link>
                </h2>

                {userInfo ? (
                    <ProfileInfo userInfo={userInfo} onLogOut={handleLogout} />
                ) : (
                    <button className="btn text-slate-400 rounded-md px-3 py-2">
                        <Link className='hover:underline hover:text-blue-400' to="/login">Login</Link>
                        /
                        <Link className='hover:underline hover:text-blue-400' to="/signup"> SignUp</Link>
                    </button>
                )}
            </div>

            {userInfo && (
                <div className="w-full">
                    <SearchBar
                        value={searchQuery}
                        onChange={({ target }) => setSearchQuery(target.value)}
                        handleSearch={handleSearch}
                        onClearSearch={onClearSearch}
                    />
                </div>
            )}
        </div>
    )
}


export default Navbar