import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';
import { getAuth, updatePassword } from "firebase/auth";
import { useDarkMode } from '@/utils/darkModeContext';

const UpdatePassword = () => {
    const [username, setUsername] = useState('');
    const [currentPassword, setcurrentPassword] = useState('');
    const [updatedPassword, setupdatedPassword] = useState('');
    const [error, setError] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [updatedPasswordRef, setPasswordRef] = useState('');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const { isDarkMode } = useDarkMode();

    const closeModal = () => {
        setEditorOpen(false);
        setSelectedFile(null);
        setScaleValue(1);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;
        
        // await updatePassword(user, currentPassword, updatedPassword, updatedPasswordRef).then(() => {
        //     axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/changePassword`, { currentPassword, updatedPassword, updatedPasswordRef })
        // });
        
        updatePassword(user, updatedPassword).then(() => {
            console.log('Password updated successfully');
        }).catch((error) => {
            console.log('Password couldn\'t be updated');
        });
    };

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
                    <div className="d-flex justify-content-center">
                        <Image src={logo} alt="logo"/>
                    </div>

                    <h2 className="m-4 text-center">Update Password</h2>

                    { error && 
                        <p className='text-center text-danger'>{error}</p>
                    }

                    { isAlertVisible &&  
                        <div className="alert alert-success text-center" role="alert">
                           { alert }
                        </div>
                    }
                    
                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputEmail1">New Password</label>
                            <input
                                type="password"
                                placeholder="password"
                                value={updatedPassword}
                                className="form-control"
                                onChange={(e) => setupdatedPassword(e.target.value)}
                            />                        
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/login" className="link-dark link-offset-2">Back to Login</Link> 
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default UpdatePassword;