import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';
import { getAuth, updatePassword } from "firebase/auth";

const UpdatePassword = () => {
    const [updatedPassword, setupdatedPassword] = useState('');
    const [confirmUpdatedPassword, setConfirmedPassword] = useState('');
    const [error, setError] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const router = useRouter(); // Initialize useRouter hook

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (updatedPassword.length < 6) {
            // alert("Password should be at least 6 characters");
            setError("Password should be at least 6 characters");
        } else if (updatedPassword === confirmUpdatedPassword) {
            updatePassword(user, updatedPassword).then(() => {
                console.log('Password updated successfully');
                alert("Password updated successfully");
                router.push('/settings');
            }).catch((error) => {
                console.log('Password couldn\'t be updated');
            });
        } else {
            // in case password field doesn't match the confirm password field it will show an error message
            // alert("Passwords don't match");
            setError("Passwords don't match");
        }
    };

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
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
                                placeholder="Password"
                                value={updatedPassword}
                                className="form-control"
                                onChange={(e) => setupdatedPassword(e.target.value)}
                            />                        
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputPassword1">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmUpdatedPassword}
                                className="form-control"
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                            />                    
                        </div>

                        <div className='text-center mt-4'>
                            <button type="submit" className="btn btn-secondary">Update Password</button>
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/settings" className="link-dark link-offset-2">Back to Settings</Link> 
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default UpdatePassword;