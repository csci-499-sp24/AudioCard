import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
    
        formData.append('image', selectedFile);
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        }
    };
    

    return (
        <div>
            <h1>Settings</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload Avatar</button>
            </form>
        </div>
    );
};

export default Settings;
