const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080;
const stripe = require("stripe")(process.env.SECRET_KEY);
const uuid = require('uuid4');
const app = express();

app.use(express.json());
app.use(cors());

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  
  try {
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotencyKey = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.price,
        currency: "cad",
        customer: customer.id,
        receipt_email: token.email,
        description: `Dinner by ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotencyKey
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});


