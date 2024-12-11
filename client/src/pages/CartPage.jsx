import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import "./CartPage.css"
import { Link } from "react-router-dom";
import {
  qtyDecrease,
  qtyIncrease,
  removeCart
} from "../redux/slices/cartSlice";

const Cart = () => {
  let Sum = 0;
  const [cartItems, setCartItems] = useState("");
  const [email, setEmail] = useState("")
  const cartData = useSelector((state) => state.cartSlice.cart);
  const dispatch = useDispatch();

  const cardQuantity = () => {
    if (cartData.length > 0) {
      setCartItems(`Cart (${cartData.length} items)`);
    } else {
      setCartItems("Your Cart is empty");
    }
  };
  useEffect(() => {
    cardQuantity();
  });
  console.log(email)

  //payment integration...
  const makePayment = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
  
    try {
      const stripe = await loadStripe("pk_test_51QUQte04TQoCZpcQUMiXvUfdYG4wrZtpbz0H3g9rvDVaMuZGDxWnSbNaSniJhZGIfNVGYWb4nu8uf70DExhO1sxK00ophnHNS0");
  
      if (!stripe) {
        throw new Error("Stripe.js failed to load");
      }
  
      const response = await fetch("http://localhost:7000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cartData, email }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
  
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error in makePayment:", error.message);
    }
  };

  return (
    <>
      <div className="cart">
        <h1 style={{color:"#003f80", fontWeight:"600"}}>Shopping Cart</h1>
        <div className="cart-container11">
          <div className="cart-part1">
            <h6 className="cart-h6">{cartItems}</h6>

            {cartData.map((key) => {
              Sum += key.quantity * key.price;
              return (
                <div className="cart-part-1-content">
                  <div className="cart-part-1-img">
                    <img src={key.image} alt="img" height="100%" width="100%" />
                  </div>
                  <div className="cart-part1-details">
                    <div className="cart-quantity-handler">
                      <h2> </h2>{" "}
                      <div>
                        {" "}
                        <span
                          onClick={() => dispatch(qtyDecrease({ id: key.id }))}
                          className="cart-quant-handler"
                        >
                          ➖
                        </span>{" "}
                        <span style={{fontWeight:"600", fontSize:"1.3vmax"}}>{key.quantity}</span>{" "}
                        <span
                          onClick={() => dispatch(qtyIncrease({ id: key.id }))}
                          className="cart-quant-handler"
                        >
                          ➕
                        </span>{" "}
                      </div>
                    </div>
                    <h6>{key.title}</h6>

                    <div className="cartremove">
                      <div className="cart-buttons">
                        <button onClick={() => dispatch(removeCart({ id: key.id }))}
                          className="cartButtons"
                        >
                          {" "}
                          <span>
                            <i class="ri-delete-bin-5-line" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                          </span>
                          <span className="wishremove">Remove Item</span>
                        </button>
                      </div>
                      <h2 className="cart-total-price">
                        {key.quantity * key.price}
                      </h2>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-part2">
            <h6 className="cart-h6">Checkout</h6>
            {cartData.map((item) => {
              return (
                <div className="cart-page-checkout">
                  <p>{item.title}</p>
                  <p>$ {item.price}</p>
                </div>
              )
            })}
            <hr></hr>
            <div className="cart-page-checkout">
              <h4>Total Price </h4>
              <h4>$ {Sum}</h4>
            </div>

            <hr size="1" />
            <div className="cart-page-checkout">
              <p>Amount to pay </p>
              <p>$ {Sum}</p>
            </div>
            <div className="cart-page-checkout">
              <input type="email" name="email" placeholder="Please Enter Your Email" onChange={(e) => {
                setEmail(e.target.value)
              }} className="email-input" />
            </div>


            <button className="go-to-checkout cartButtons" onClick={makePayment}>
              <Link>Proceed to Checkout</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
