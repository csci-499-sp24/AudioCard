import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import styles from '../styles/avatarChangeModal.module.css';

const AvatarChangeModal = ({ isOpen, onClose, imageSrc, onSave, isDarkMode }) => {
    const [scaleValue, setScaleValue] = useState(1);
    const avatarEditorRef = useRef(null);

    if (!isOpen || !imageSrc) return null;

    const handleSaveAvatar = () => {
        if (avatarEditorRef.current) {
            const canvasScaled = avatarEditorRef.current.getImageScaledToCanvas();
            canvasScaled.toBlob(blob => {
                onSave(blob);
            }, 'image/jpeg');
        }
    };

    return (
        <div className={styles.overlay} >
            <div className={styles.modal} style={{backgroundColor: isDarkMode ? 'gray' : 'white' }}>
                <AvatarEditor
                    ref={avatarEditorRef}
                    image={imageSrc}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]}
                    scale={scaleValue}
                    rotate={0}
                />
                <input
                    type="range"
                    onChange={(e) => setScaleValue(parseFloat(e.target.value))}
                    min="1"
                    max="2"
                    step="0.01"
                    defaultValue="1"
                />
                <button onClick={handleSaveAvatar} className={styles.uploadButton}>Save Avatar</button>
                <button onClick={onClose} className={styles.closeButton}>Cancel</button>
            </div>
        </div>
    );
};

export default AvatarChangeModal;
