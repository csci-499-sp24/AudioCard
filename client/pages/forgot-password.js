import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { auth } from '../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';

const ForgotPassword = () => {
    
    return (
        <div className="container">
            forgot password
        </div>
    )
    
}


export default ForgotPassword;