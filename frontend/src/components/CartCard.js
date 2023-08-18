import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { changeCurrProduct } from "../actions/index"

function CartCard({item}) {

  const nav = useNavigate()
  const dispatch = useDispatch();
 
  const handleNav = () => {
    dispatch(changeCurrProduct(item?.product))
    nav("/productdetails")
  }

  const removeFromCart = () => {
    let data = []
    data = JSON.parse(localStorage.getItem("flipkart"));
    localStorage.removeItem("flipkart");
    data.filter((obj) => obj.productId    !== item?.productId);
    localStorage.setItem("flipkart", JSON.stringify(data));
    console.log(data);
    window.location.reload()
  };

  return (
    <div className="bg-[#e1ecf1] cursor-pointer border-[1px] border-slate-500 rounded p-3">
      <section className="cursor-pointer flex">
        <img
          src={
            "https://cdn.pixabay.com/photo/2023/05/15/08/52/flower-7994489_1280.jpg"
          }
          alt="Image"
          className="xl:w-1/4 w-5/12 min-h-44 flex-grow rounded"
          onClick={handleNav}
        />
        <div className="xl:w-3/4 w-7/12 flex flex-col justify-between pl-3 pr-3 pt-1 pb-1">
          <div>
            <h2 className="text-lg font-semibold leading-5">
              {item.product.name}
            </h2>
            <h3 className="text-slate-700 mt-2">
              {item?.product?.description.slice(0,150)}
            </h3>
          </div>
          <div className="flex gap-[15px] mt-2">
            <h3 className="text-center font-semibold pt-2 pb-2 pl-3 pr-3 border-[1px] border-slate-500 bg-[#aedbef]">
              {item?.product.price} MATIC
            </h3>
            <h3 onClick={removeFromCart} className="text-center cursor-pointer font-semibold pt-2 pb-2 pl-3 pr-3 border-[1px] border-slate-500 bg-[#aedbef]">
              Remove
            </h3>
            <h3 className="text-center cursor-pointer font-semibold pt-2 pb-2 pl-3 pr-3 border-[1px] border-slate-500 bg-[#aedbef]">
              Items: {item?.quantity}
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartCard;
