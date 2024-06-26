import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';

const ShareFunction = ({ userid, cardsetId, isOwner, isPublic }) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [role, setRole] = useState('');
    const [curuserId, setcurUserId] = useState(null); // State to store the user ID
    const [error, setError] = useState(null); // State to handle errors
    const [isCopySuccess, setIsCopySuccess] = useState(false);

    useEffect(() => {
        if (curuserId !== null) {
            console.log("Sharing with user ID:", curuserId, "and role:", role);
            handleShareLogic(curuserId);
        }
    }, [curuserId]); // Run this effect whenever curuserId changes

    const handleShare = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/userCheck/${emailOrUsername}`);
            setcurUserId(response.data.userId);
            setError(null);
        } catch (error) {
            console.error('Error checking user:', error);
            setError(error.message);
        }
    };

    const handleShareLogic = async (userId) => {
        try {
            const shareresponse = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userid}/cardsets/${cardsetId}/shared/${cardsetId}/share?userid=${userId}&authority=${role}`);
            console.log('Sharing response:', shareresponse.data);
            setEmailOrUsername('');
            setRole('');
        } catch (error) {
            console.error('Error sharing card set:', error);
            setError(error.message);
        }
    };

    const handleCardSetURLCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);

            setIsCopySuccess(true);

            setTimeout(() => {
                setIsCopySuccess(false);
            }, 2000);
        } 
        catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div>
            <div>
                <h2 className='text-center mt-2'>Share your card set</h2>
            </div> 
            <div class="mb-3 row d-flex justify-content-center mt-4">
                <div class="col-sm-10">
                    <input type="text" readonly class="form-control" placeholder="Enter Email or Username" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
                </div>
            </div>

            <div class="mb-3 row d-flex justify-content-center">
                <div class="col-sm-10 d-flex justify-content-begin align-items-center">
                <select class="form-select" aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                    
                        {isPublic === false &&  <option value="read-only">Viewer</option> }
                            <option value="edit">Editor</option>
                        {isOwner ?
                            <option value="admin">Admin</option>
                        :null}
                    </select>

                    <div>
                        <i className="bi bi-question-circle-fill " style={{ 'marginLeft': '5px'}}
                        data-tooltip-id="rolesTip"
                        data-tooltip-place='right'
                        data-tooltip-html={
                            isPublic 
                            ? "Admins can edit, add or remove editors, view collaborator list<br/>Editors can edit, view collaborator list"
                            : "Admins can edit, add or remove editors/viewers, view collaborator list<br/>Editors can edit, view collaborator list<br/>Viewers can view the card set"
                        }></i>
                        <Tooltip id = "rolesTip"/> 
                    </div>
                </div>
            </div>

            {error && <p className="text-center mt-3" style={{ color: 'red' }}>{error}</p>}

            <div className='text-center '>
                <button className='btn btn-secondary mt-3' onClick={() => handleShare()}>Share</button>
            </div>
            
            <div className='linkShareContainer mb-2'>
            <div className='row mt-4 d-flex justify-content-center'>  
            <div className='col text-center d-flex align-items-center'>
                <hr className="w-50" />
                <span className="mx-2">OR</span>
                <hr className="w-50" />
            </div>
            </div> 
            <div className='row mt-4'>
                <div className='text-center d-flex align-items-center justify-content-center'>
                <div className='me-3 ms-2'>Copy link:</div> 
                <button className='btn btn-secondary me-2' onClick={handleCardSetURLCopy} disabled={isCopySuccess}>
                    <i className="bi bi-copy"></i>
                </button>
                <span style={{ width: '1.25rem' }}>
                    {isCopySuccess && <i className="bi bi-check-lg" style={{color: 'green', fontSize: 'large'}}></i>}
                </span>
                </div>
            </div>
            </div> 


        </div>
    );
};

export default ShareFunction;
