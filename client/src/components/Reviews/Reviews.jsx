import React, {useRef, useState, useEffect} from 'react'
import '../Reviews/reviews.scss';
import {useParams} from 'react-router-dom';
import fire from '../../config/fire';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


function Reviews({user}) {

  const db = fire.firestore()
  let {id} = useParams();
  let [reviews, setReviews] = useState([]);
  const review = useRef();
  const timestamp = fire.firestore.FieldValue.serverTimestamp();
  
  useEffect(() => {
    db.doc(`chefs/${id}`)
    .collection("reviews")
    .orderBy('createdAt', 'desc')
    .onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => (
        doc.data()
        ));
        setReviews(data);
      });
    }, []);

    
    const reviewSubmit = (event) => {
      event.preventDefault();
      db.doc(`chefs/${id}`).collection("reviews").add({
        reviews: review.current.value,
        from: user.email,                                 //add current user's email to review without input field
        createdAt: timestamp
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
      
      event.target.reset();
    };

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
    <section className="reviews" id="reviews">
      <h4 className="reviews__title">Testimonials</h4>
      <div className="reviews__all">
        <Carousel 
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} 
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-50-px">

            {reviews.map(review => 
              <p className="reviews__single" key={review.createdAt}>"{review.reviews}" <br/>- {review.from}</p>
              )} 

        </Carousel>
      </div>
      <div className="reviews__form-section">
        <form className="reviews__form" onSubmit={reviewSubmit}>
          <label htmlFor="name" className="reviews__form-label">Add a Review:</label>
          <textarea 
            className="reviews__form-review-input"
            name="review" 
            id="review" 
            rows="5"
            wrap="hard"
            placeholder="Tell us about your experience..."
            ref={review}
            required></textarea>
          <button className="reviews__form-button" type="submit">SUBMIT</button>
          </form>
      </div>
    </section>
  );
};


export default Reviews