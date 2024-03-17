import React, {useState} from 'react';
import axios from 'axios';
import styles from '../styles/createACardSet.module.css';

export const CreateCardset = ({userId, onCreateCardset}) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        setIsSubmitted(true);
        if (userId){
            const newSetData = {
                title: event.target.title.value,
                subject: event.target.subject.value,
                isPublic: event.target.isPublic.checked
            }
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets`, { newSetData });
            onCreateCardset();
        }
    }

    return (
        <div className="mb-5 p-4" id={styles.createCardset}>
            <h5>Create a new cardset</h5>

            <form className="row row-cols-lg-auto g-3 align-items-center" onSubmit={(e) => onSubmit(e)}>
                <div className="col-12">
                    <label className="visually-hidden" htmlFor="title">Title</label>
                    <div className="input-group">
                        <input type="text" id="title" name="title" className="form-control" placeholder="Title"/>
                    </div>
                </div>

                <div className="col-12">
                    <label className="visually-hidden" htmlFor="subject">Subject</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="subject" placeholder="Subject"/>
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isPublic"/>
                        <label className="form-check-label" htmlFor="isPublic">
                            Make publicly viewable?
                        </label>
                    </div>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-secondary" disabled={isSubmitted}>
                        {isSubmitted ? "Set Created" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    )
}
