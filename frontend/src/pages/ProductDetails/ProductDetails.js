import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import { useStateContext } from "../../context";
import { useSelector, useDispatch } from "react-redux";

function ProductDetails() {
  const [count, setCount] = useState(1);

  const { purchaseProduct } = useStateContext();

  const myProduct = useSelector((state) => state.changeCurrProduct);

  console.log(myProduct);

  const purchase = async () => {
    try {
      const data = await purchaseProduct([0], [1], [true], 1, 2, 0);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(myProduct)

  const addToCart = () => {
    let data = []
    data = JSON.parse(localStorage.getItem("flipkart"));
    if (data) {
      let flag = [];
      flag = data.filter((item)=>
        item.product.productId === myProduct.productId
      )
      if(flag.length === 0){
        data.push({product:myProduct, quantity:count});
        localStorage.setItem("flipkart", JSON.stringify(data));
        console.log("HA")
      }else{
        let i;
        console.log("NA")
        for(i=0;i<data.length;i++){
          if(data[i].product.productId === myProduct.productId){
            data[i].quantity = data[i].quantity + count;
          }
        }
        localStorage.setItem("flipkart", JSON.stringify(data));
      }

      
    }
    else{
      localStorage.setItem("flipkart", JSON.stringify([{product:myProduct, quantity:count}]));
      console.log("hi")
    }
    console.log(data);
  };

  return (
    <div>
      <Navbar />
      <section className="flex min-h-[95vh] flex-col justify-center pt-10 pb-10 xl:pl-24 xl:pr-24 lg:pl-12 lg:pr-12 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">
        <div className="lg:flex gap-[25px] rounded border-[2px] border-slate-500 md:p-4 p-2">
          <div className="lg:min-h-[450px] lg:w-1/2 w-full">
            <img
              src={myProduct?.imageURI}
              className="h-full w-full rounded lg:max-h-[1000px] md:max-h-[400px] sm:max-h-[320px] max-h-[250px]"
            />
          </div>
          <section className="lg:w-1/2 w-full lg:pt-0 pt-5 flex flex-col justify-between">
            <div className="">
              <h2 className="text-4xl font-semibold">{myProduct?.name}</h2>
              <h4 className="text-slate-600 mt-3">{myProduct?.description}</h4>
              <h3 className="font-semibold text-2xl mt-2">
                {myProduct?.price} MATIC ({myProduct?.loyaltyTokensAccepted}{" "}
                FLIPS can be used)
              </h3>
            </div>
            <div className=" mt-8">
              <section className="flex gap-[10px]">
                <AiFillCaretLeft
                  onClick={() => {
                    setCount(count - 1);
                  }}
                  className="h-10 cursor-pointer w-10"
                />
                <div className="flex flex-col justify-center">
                  <h5 className="font-semibold text-xl">{count}</h5>
                </div>
                <AiFillCaretRight
                  onClick={() => {
                    setCount(count + 1);
                  }}
                  className="h-10 cursor-pointer w-10"
                />
              </section>
              <div className="grid grid-cols-2 gap-[12px] mt-6">
                <h3
                  onClick={addToCart}
                  className="pt-3 pb-3 cursor-pointer text-center bg-blue-600 text-slate-100 rounded"
                >
                  Add To Cart
                </h3>
                <h3
                  onClick={purchase}
                  className="pt-3 pb-3 cursor-pointer text-center bg-blue-600 text-slate-100 rounded"
                >
                  Buy Now
                </h3>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
