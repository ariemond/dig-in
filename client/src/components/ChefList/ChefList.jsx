import React, { useState, useEffect } from 'react';
import '../ChefList/chefList.scss';
import ChefCard from '../ChefCard/ChefCard';
import fire from '../../config/fire';


function ChefList() {

    const db = fire.firestore();
    let params = (new URL(document.location)).searchParams;
    let city = params.get('location');

    //Making search input for city case insensitive 
    const uppercaseCity = (city) => {
        let splitCity = city.split(" ")
        let newCity = splitCity.map(word => {
            word = word.split("")
            word[0] = word[0].toUpperCase()
            return word.join("")
        }) 
        return newCity.join(" ");
    };

    //Initial Firebase call to get all chefs that match query
   const [chefs, setChefs] = useState([]);
   const [allChefs, setAllChefs] = useState([]);
   const ref = db.collection('chefs').where("location", "==", uppercaseCity(city));

   function getChefs() {
       ref.onSnapshot((querySnapshot) => {
           const chefsSnapshot = [];
           querySnapshot.forEach((doc) => {
               chefsSnapshot.push({...doc.data(), id: doc.id});
           });
           setChefs(chefsSnapshot);
           setAllChefs(chefsSnapshot);
       });
    };
   
   useEffect(() => {
       getChefs(); 
    }, []);


    //Restaurant Search Bar
    const [searchTerm, setSearchTerm] = useState("");
    
    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const results = allChefs.filter(chef => 
            chef.restaurant.toLowerCase().includes(searchTerm)
        );
        setChefs(results);
    }, [searchTerm]);


    //Cuisine Search Bar
    const [cuisineSearchTerm, setCuisineSearchTerm] = useState("");
    
    const handleCuisineChange = e => {
        setCuisineSearchTerm(e.target.value);
    };

    useEffect(() => {
        const results = allChefs.filter(chef => 
            chef.cuisine.toLowerCase().includes(cuisineSearchTerm)
        );
        setChefs(results); 

    }, [cuisineSearchTerm]);


    return (
        <section className="chefs">
            <h2 className="chefs__title">Select a Chef</h2>
            <div className="chefs__search-container">
                <input 
                    type="text" 
                    placeholder="Search by restaurant" 
                    className="chefs__search-rest"
                    value={searchTerm}
                    onChange={handleChange}/>
                <input 
                    type="text" 
                    placeholder="Search by cuisine" 
                    className="chefs__search"
                    value={cuisineSearchTerm}
                    onChange={handleCuisineChange}/>
            </div>
            <div className="chefs__list">
            {chefs.map((chef) => 
                <ChefCard 
                    id={chef.id}
                    key={chef.id}
                    name={chef.name}
                    image={chef.image}
                    location={chef.location}
                    cuisine={chef.cuisine}
                    restaurant={chef.restaurant}
                    allergy={chef.allergy}
                    wage={chef.wage}
                    rating={chef.rating}/>)}
            </div>
        </section>
    );
};
                
                
export default ChefList