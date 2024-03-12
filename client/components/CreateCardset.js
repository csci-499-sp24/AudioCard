import React from 'react';
import axios from 'axios';
import styles from '../styles/createACardSet.module.css';

export const CreateCardset = ({userId, onCreateCardset}) => {
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        if (userId){
            const newSetData = {
                title: event.target.title.value,
                subject: event.target.subject.value,
                isPublic: event.target.isPublic.checked
            }
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+`/api/cardsets/${userId}`, { newSetData });
            onCreateCardset();
        }
    }

  return (
    <div className={`rounded p-10 ${styles.formContainer}`}>
        <div className="container">
            <div className="row justify-content-center">
                <div className="text-center">Create a cardset</div>
            </div>
        <form className="display flex flex-col" onSubmit={(e) => onSubmit(e)}>
        <div className="row">
            <div className="form-group text-center">
            <label htmlFor="title" className="basis-1/2">Title: </label>
            <input type="text" id="title" name="title"/>
            </div>
        </div>
        <div className="row">
            <div className="form-group text-center">
            <label htmlFor="subject">Subject: </label>
            <input type="text" id="subject" name="subject"/>
            </div>
        </div>
        <div className="row">
            <div className="form-group text-center">
            <label htmlFor="isPublic" className="basis-1/2">Make publicly viewable?:  </label>
            <input type="checkbox" id="isPublic" name="isPublic"/>
            </div>
        </div>
        <div className="row d-flex justify-content-center">
        <button type="submit" className="btn btn-secondary smallButton">Submit</button>
        </div>
        </form>
        </div>
    </div>
    
  )
}