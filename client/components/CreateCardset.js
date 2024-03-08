import React from 'react';
import axios from 'axios';

export const CreateCardset = ({userId, onCreateCardset}) => {
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        if (userId){
            const newSetData = {
                title: event.target.title.value,
                subject: event.target.subject.value,
                isPublic: event.target.isPublic.checked
            }
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+'/api/createcardset', {userId, newSetData});
            onCreateCardset();
        }
    }

  return (
    <div className="bg-slate-500 w-min">
        <div>Create a cardset</div>
        <form className="display flex flex-col" onSubmit={(e) => onSubmit(e)}>
        <div className="flex flex-row">
            <label htmlFor="title" className="basis-1/2">Title: </label>
            <input type="text" id="title" name="title"/>
        </div>
        <div className="flex flex-row">
            <label htmlFor="subject">Subject: </label>
            <input type="text" id="subject" name="subject"/>
        </div>
        <div className="flex flex-row">
            <label htmlFor="isPublic" className="basis-1/2">Make publicly viewable? : </label>
            <input type="checkbox" id="isPublic" name="isPublic"/>
        </div>
        <button type="submit">Submit</button>
        </form>

    </div>
    
  )
}