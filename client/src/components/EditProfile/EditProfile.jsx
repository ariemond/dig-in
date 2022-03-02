import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import '../EditProfile/editProfile.scss';
import fire from '../../config/fire';
import Modal from 'react-modal';
import Modal2 from 'react-responsive-modal';
import ChefMessages from '../ChefMessages/ChefMessages';
import AddPhotos from '../AddPhotos/AddPhotos';
import DeleteModal from '../DeleteModal/DeleteModal';
import BookingCalendar from 'react-booking-calendar';
import {storage} from '../../config/fire';
import 'react-day-picker/lib/style.css';


//MUST BE LOGGED IN AS AN EXISTING CHEF TO VIEW THIS PAGE
//TRY chefali@digin.com, password 123456
//OR CREATE A CHEF AND THEN VIEW EDIT


function EditProfile({user}){
    const [currentChef, setCurrentChef] = useState({});
    const [isOpen, setOpenModal] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [wage, setWage] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [allergy, setAllergy] = useState("");
    const [image, setImage] = useState(null);
    const [url, setURL] = useState("");
    const [currentDoc, setCurrentDoc] = useState();
    const [dishes, setDishes] = useState([]);

    const history = useHistory();
    const db = fire.firestore();
    const newID = user.uid;
    const ref = db.collection('chefs').where('id', '==', newID);     //need to target the logged in user with the id field in chef collection that has matching uid


    //Get current chef that is logged in, grab the document ID to be able to run update function
    
    const getCurrentChef = () => {
        ref.onSnapshot((querySnapshot) => {

            const chefSnapshot = [];
            let docID;
            querySnapshot.forEach((doc) => {
                chefSnapshot.push({...doc.data(), id: doc.id});
                docID = doc.id;
            });
            setCurrentChef(chefSnapshot[0]);
            setCurrentDoc(docID);
        });
        getEdits();
    };
    
    useEffect(() => {
        if(user) {
            getCurrentChef(); 
        }
     }, []);

     const getEdits = () => {
         setLocation(currentChef.location);
         setDescription(currentChef.description);
         setRestaurant(currentChef.restaurant);
         setAllergy(currentChef.allergy);
         setWage(currentChef.wage);
         setCuisine(currentChef.cuisine);
    }
        
     useEffect(() => {
        if(currentChef) {
            getEdits(); 
        }
     }, [currentChef]);
     

     function editProfile(e){
        e.preventDefault();
        db.doc(`chefs/${currentDoc}`).update({
                image,
                description,
                wage,
                cuisine,
                restaurant,
                allergy,
                location
            })
        .then(res => {
            history.push(`/chefs/${currentDoc}`);
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

    //Message Modal handlers
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false)
    };


    //Photos of dishes
    useEffect(() => {
        db.doc(`chefs/${currentDoc}`)
            .collection("photos")
            .onSnapshot((querySnapshot) => {
              const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setDishes(data);
            });
        }, []);


    //Calendar
    const bookings = [
        new Date(2021, 1, 13),
        new Date(2021, 1, 2),
        new Date(2021, 1, 14),
        new Date(2021, 1, 6),
        new Date(2021, 1, 20),
        new Date(2021, 1, 11),
        new Date(2021, 1, 26),
    ];


    //Delete profile
    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    };

    const deleteProfile = () => {
        db.doc(`chefs/${currentDoc}`)
        .delete()
        .then(res => {
            history.push(`/createprofile`);
            window.scrollTo(0, 0);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
    };
    

    if (!user || !currentChef) {
        return <div></div>
    }

    return (
        <div className="edit-profile">
            <div className="edit-profile__card">
                <img src={url ? url : currentChef.image} alt="Chef" className="edit-profile__image"/>
                <div className="edit-profile__top-container"></div>
                <div className="edit-profile__info">
                    <div className="edit-profile__chef-container">
                        <h1 className="edit-profile__name">Welcome Back, Chef {currentChef.name}!</h1>
                        <button onClick={handleOpenModal} className="edit-profile__connect-button">View Messages</button>
                        <h2 className="edit-profile__edit-header">Edit Your Profile:</h2>
                    </div>
                    <div className="edit-profile__wage-container">
                        <h4 className="edit-profile__add-photo">Add Photo</h4>
                        <form onSubmit={handleUpload}>
                            <label className="edit-profile__image-input">
                                Choose File
                                <input className="edit-profile__input-button" type="file" onChange={handleImage} />
                            </label>
                            <button className="edit-profile__image-button" disabled={!image}>Upload</button>
                        </form>
                    </div>
                    <form className="edit-profile__form" onSubmit={editProfile}>
                        <div className="edit-profile__about-container">
                            <h4 className="edit-profile__about">About Me</h4>
                            <textarea 
                                className="edit-profile__about-input"
                                type="text"
                                name="description"
                                value={description}
                                onChange={handleDescription}
                            />
                        </div>
                        <div className="edit-profile__wage-container">
                            <h4 className="edit-profile__wage">Pricing Per Head</h4>
                            <input 
                            className="edit-profile__wage-input"
                            type="text"
                            name="wage"
                            value={wage}
                            onChange={handleWage}/>
                        </div>
                        <div className="edit-profile__rest-container">
                            <h4 className="edit-profile__restaurant">Restaurant</h4>
                            <input 
                            className="edit-profile__rest-input"
                            type="text"
                            name="restaurant"
                            value={restaurant}
                            onChange={handleRestaurant}/>
                        </div>
                        <div className="edit-profile__cuisine-container">
                            <h4 className="edit-profile__cuisine">Cuisine</h4>
                            <input 
                            className="edit-profile__cuisine-input"
                            type="text"
                            name="cuisine"
                            value={cuisine}
                            onChange={handleCuisine}/>
                        </div>
                        <div className="edit-profile__cuisine-container">
                            <h4 className="edit-profile__cuisine">Location</h4>
                            <input 
                            className="edit-profile__cuisine-input"
                            type="text"
                            name="location"
                            value={location}
                            onChange={handleLocation}/>
                        </div>
                        <div className="edit-profile__allergies">
                            <h4 className="edit-profile__allergy">Allergy Friendly</h4>
                            <select 
                                className="edit-profile__allergy-input" 
                                name="allergy"
                                id="allergy"
                                value={allergy}
                                onChange={handleAllergy}>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>
                        </div>
                        <div className="edit-profile__add-photos">
                        {!!dishes ? <AddPhotos dishes={dishes} id={currentDoc} user={user}/> : null}
                        </div>
                        <div className="edit-profile__calendar-section">
                            <h4 className="edit-profile__availability">Update Availability:</h4>
                            <BookingCalendar
                                    bookings={bookings}
                                    clickable={true}
                                    />
                            <button className="edit-profile__button">SUBMIT</button>
                        </div>
                    </form>
                    <div className="edit-profile__delete">
                        <button onClick={handleDeleteOpen} className="edit-profile__delete-button">Delete Profile</button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={handleCloseModal}
                ariaHideApp={false}
                style={{
                    content: {
                    top: "40%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    },
                }}>
                    <ChefMessages id={currentDoc} closeModal={handleCloseModal} name={currentChef.name} user={user}/>
            </Modal>

            <Modal2
                open={deleteOpen}
                onClose={handleDeleteClose}
                ariaHideApp={false}
                style={{
                    content: {
                    top: "40%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    },
                }}>
                    <DeleteModal id={currentDoc} closeModal={handleDeleteClose} delete={deleteProfile}/>
            </Modal2>
        </div>
        );
    };
                

export default EditProfile