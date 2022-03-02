import React, {useState, useEffect} from 'react'
import '../AddPhotos/addPhotos.scss';
import fire from '../../config/fire';
import {storage} from '../../config/fire';


function AddPhotos({user, id}) {

  const db = fire.firestore();
  const [image, setImage] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [url, setURL] = useState("");

  useEffect(() => {
    db.doc(`chefs/${id}`)
        .collection("photos")
        .onSnapshot((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => (
                doc.data()
            ));
            setDishes(data);
        });
    }, [id]);
    
    
    //Upload image
    const handleImage = e => {
        setImage(e.target.files[0])
        };

    const handleUpload = e => {
        console.log(e)
        e.preventDefault();

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on("state_changed", console.log, console.error, () => {
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
                console.log(url)
                setImage(url);
                setURL(url);

                db.doc(`chefs/${id}`).collection("photos").add({
                    image: url
                });
            })
        });
    };


    if (!user) {
        return <div></div>
    }
   
    return (
        <section className="add-photos">
        <h4 className="add-photos__title">Your Photos</h4>
            <div className="add-photos__wage-container">
                <form className="add-photos__form">
                    <label className="add-photos__image-input">
                        Choose File
                        <input className="add-photos__input-button" type="file" onChange={handleImage} />
                    </label>
                    <button onClick={handleUpload} className="add-photos__image-button" disabled={!image}>Upload</button>
                </form>
            </div>
            <div className="add-photos__photos">
                {!!dishes && dishes.map(dish => 
                <img className="add-photos__single" key={dish.id} src={dish.image} alt="Chef's Dish"/>
                )} 
            </div>
        </section>
    );
};    

export default AddPhotos