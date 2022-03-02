import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../AddChef/addChef.scss';
import fire from '../../config/fire';
import 'react-day-picker/lib/style.css';
import {storage} from '../../config/fire';

//MUST BE LOGGED IN AS AN EXISTING CHEF TO VIEW THIS PAGE
//TRY chefjoe@digin.com, password 123456


function AddChef({user}){
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [wage, setWage] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [allergy, setAllergy] = useState("");
    const [image, setImage] = useState(null);
    const [url, setURL] = useState("");

    const history = useHistory();
    const db = fire.firestore();
    const ref = db.collection('chefs');     //need to target the logged in user with the id field in chef collection that has matching uid
    
    
     function addChef(e){
        e.preventDefault();

        ref.add({
            name,
                image,
                description,
                wage,
                cuisine,
                restaurant,
                allergy,
                location,
                id: user.uid
            })
            .then(res => {
            const id = res.id;
            history.push(`/chefs/${id}`);
            window.scrollTo(0, 0);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
     };


     //Upload image

     const handleImage = e => {
        setImage(e.target.files[0])
     };

     const handleUpload = e => {
         e.preventDefault();

         const uploadTask = storage.ref(`images/${image.name}`).put(image);

         uploadTask.on("state_changed", console.log, console.error, () => {
             storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    setImage(url);
                    setURL(url);
                });
         });
     };


    //onChange handlers for each input field

    const handleName = e => {
        setName(e.target.value);
    };
    
    const handleDescription = e => {
        setDescription(e.target.value);
    };

     const handleWage = e => {
        setWage(e.target.value);
    };

    const handleRestaurant = e => {
        setRestaurant(e.target.value);
    };

    const handleCuisine = e => {
        setCuisine(e.target.value);
    };

    const handleLocation = e => {
        setLocation(e.target.value);
    };

    const handleAllergy = e => {
        setAllergy(e.target.value);
    };

    
    if (!user) {
        return <div></div>
    }

    return (
        <div className="add-chef">
            <div className="add-chef__card">
                <img src={url} alt="Upload a photo" className="add-chef__image"/>
                <div className="add-chef__top-container"></div>
                <div className="add-chef__info">
                    <div className="add-chef__chef-container">
                        <h1 className="add-chef__name">Create a Chef Profile:</h1>
                    </div>
                    <div className="add-chef__wage-container">
                        <h4 className="add-chef__wage">Add Photo</h4>
                        <form onSubmit={handleUpload}>
                            <label className="add-chef__image-input">
                                Choose File
                                <input className="add-chef__input-button" type="file" onChange={handleImage} />
                            </label>
                            <button className="add-chef__image-button" disabled={!image}>Upload</button>
                        </form>
                    </div>
                    <form className="add-chef__form" onSubmit={addChef}>
                        <div className="add-chef__wage-container">
                            <h4 className="add-chef__wage">Name</h4>
                            <input 
                            className="add-chef__wage-input"
                            type="text"
                            name="name"
                            placeholder="First name"
                            onChange={handleName}/>
                        </div>
                        <div className="add-chef__about-container">
                            <h4 className="add-chef__about">About Me</h4>
                            <textarea 
                                className="add-chef__about-input"
                                type="text"
                                name="description"
                                placeholder="Tell us a little bit about yourself and the way you like to cook."
                                onChange={handleDescription}/>
                        </div>
                        <div className="add-chef__wage-container">
                            <h4 className="add-chef__wage">Pricing Per Head</h4>
                            <input 
                            className="add-chef__wage-input"
                            type="text"
                            name="wage"
                            placeholder="Ex. 60"
                            onChange={handleWage}/>
                        </div>
                        <div className="add-chef__rest-container">
                            <h4 className="add-chef__restaurant">Restaurant</h4>
                            <input 
                            className="add-chef__rest-input"
                            type="text"
                            name="restaurant"
                            placeholder="Ex. Alo"
                            onChange={handleRestaurant}/>
                        </div>
                        <div className="add-chef__cuisine-container">
                            <h4 className="add-chef__cuisine">Cuisine</h4>
                            <input 
                            className="add-chef__cuisine-input"
                            type="text"
                            name="cuisine"
                            placeholder="Ex. French"
                            onChange={handleCuisine}/>
                        </div>
                        <div className="add-chef__cuisine-container">
                            <h4 className="add-chef__cuisine">Location</h4>
                            <input 
                            className="add-chef__cuisine-input"
                            type="text"
                            name="location"
                            placeholder="City"
                            onChange={handleLocation}/>
                        </div>
                        <div className="add-chef__allergies">
                            <h4 className="add-chef__allergy">Allergy Friendly</h4>
                            <select 
                                className="add-chef__allergy-input" 
                                name="allergy"
                                id="allergy"
                                value={allergy}
                                onChange={handleAllergy}>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>
                        </div>
                        <button className="add-chef__button">SUBMIT</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
                

export default AddChef