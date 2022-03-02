import React, {useState, useEffect} from 'react'
import '../Dishes/dishes.scss';
import {useParams} from 'react-router-dom';
import fire from '../../config/fire';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


function Dishes({name}) {

  const db = fire.firestore()
  let {id} = useParams();
  let [dishes, setDishes] = useState([]);
  

  useEffect(() => {
    db.doc(`chefs/${id}`)
    .collection("photos")
    .onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => (
        doc.data()
        ));
        setDishes(data);
      });
    }, []);


  //mandatory props for carousel component
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 1,
      slidesToSlide: 1 
    },
    tablet: {
      breakpoint: { max: 1200, min: 768 },
      items: 1,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };
   
  return (
    <section className="dishes" id="dishes">
      <h4 className="dishes__title">{name}'s Dishes</h4>
      <div className="dishes__all">
        <Carousel 
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} 
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px">

            {dishes.map(dish => 
              <img className="dishes__single" key={dish.image} src={dish.image} alt="Chef's Dish"/>
              )} 

        </Carousel>
      </div>
    </section>
  );
};


export default Dishes