import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import modalStyles from '@/styles/requestModal.module.css';
import axios from 'axios';
import { useDarkMode } from '@/utils/darkModeContext';

export const PrivateCardsetModal = ({ handleRequestAccess, userId, cardsetId, access }) => {
    const { isDarkMode } = useDarkMode();
    const router = useRouter();
    const [requestedAuthority, setRequestedAuthority] = useState('read-only');
    const [isRequestPending, setIsRequestPending] = useState(false);
    const [requestMade, setRequestMade] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    useEffect(() => {
        checkIfRequested();
        const myModal = new bootstrap.Modal('#staticBackdrop');
        console.log(access);
        if (access) {
            
        } else {
            myModal.show();
        }
    },[requestMade, access]);

    const checkIfRequested = async () => {
        await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/cardsets/${cardsetId}/request?requestorId=${userId}`)
        .then(response => {
            setIsRequestPending(true);
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                setIsRequestPending(false);
            } else {
                // Other error occurred
                console.error('Error fetching cardset requests:', error);
            }
        });
    }

    const handleSubmit = () => {
        handleRequestAccess(requestedAuthority);
        setRequestMade(true);
    };

    return (
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog" id={`${isDarkMode ? modalStyles.RequestModalDarkContainer : modalStyles.RequestModalLightContainer}`}>
                <div className="modal-content text-center" id={`${isDarkMode ? modalStyles.RequestModalDark : modalStyles.RequestModalLight}`}>
                    <div className="">
                        <h1 className="modal-title fs-3" id="staticBackdropLabel">Private Card set</h1>
                    </div>

                    <div className="modal-body">
                        Request access or return to the previous page
                    </div>

                    <div className="modal-body">
                        {requestMade &&
                            <div>The card set owner has been notified of your request</div>
                        }

                        {!isRequestPending && !requestMade ? 
                            <div>
                                Request 
                                <select className='mx-2' value={requestedAuthority} onChange={(e) => setRequestedAuthority(e.target.value)}>
                                    <option value="read-only">Viewing</option>
                                    <option value="edit">Editing</option>
                                </select>
                                access to this cardset {/*"{testCardsetData?.title}" from user "{Owner}"*/}
                                <br/>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Request Access</button>
                            </div>
                            : !requestMade ?
                                <div>You already have a pending request</div>
                            : isRequestPending &&
                                <div>You already have a pending request</div>
                        }
                    </div>

                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => router.back()}>Return</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
