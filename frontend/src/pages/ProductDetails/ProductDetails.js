import React, {useState} from "react";
import Navbar from "../../components/Navbar";
import { AiFillCaretLeft } from "react-icons/ai"
import { AiFillCaretRight } from "react-icons/ai"

function ProductDetails() {

  const [count, setCount] = useState(1);

  return (
    <div>
      <Navbar />
      <section className="flex min-h-[95vh] flex-col justify-center pt-10 pb-10 xl:pl-24 xl:pr-24 lg:pl-12 lg:pr-12 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">
        <div className="lg:flex gap-[25px] rounded border-[2px] border-slate-500 md:p-4 p-2">
          <div className="lg:min-h-[450px] lg:w-1/2 w-full">
            <img
              src={
                "https://cdn.pixabay.com/photo/2023/05/15/08/52/flower-7994489_1280.jpg"
              }
              className="h-full w-full rounded lg:max-h-[1000px] md:max-h-[400px] sm:max-h-[320px] max-h-[250px]"
            />
          </div>
          <section className="lg:w-1/2 w-full lg:pt-0 pt-5 flex flex-col justify-between">
            <div className="">
              <h2 className="text-4xl font-semibold">Koi Toh Product Hai</h2>
              <h4 className="text-slate-600 mt-3">
                This Joy sunscreen is formulated with natural sunscreen agents
                like Papaya and Saffron which provide effective protection from
                UVA and UVB rays. It prevents skin tanning due to the damaging
                effects of sun rays. The sunscreen offers oil free
                moisturisation with long lasting fairness and sweat-free feel.
                Containing Vitamin A and Papain enzyme, papaya helps remove dead
                skin cells and inactive proteins, thus rejuvenating your skin
                and help the skin repair itself. It also helps keep your skin
                hydrated and gradually reduces the appearance of dark patches,
                thus lightening your skin. Saffron contains essential vitamins
                and antioxidants that are beneficial to the skin. It is
                anti-inflammatory and soothes skin. It is a dermatologically
                tested product. Discontinue use if skin irritation or rashes
                occur.
              </h4>
              <h3 className="font-semibold text-2xl mt-2">
                20 MATIC (4 FLIPS can be used)
              </h3>
            </div>
            <div className=" mt-8">
              <section className="flex gap-[10px]">
                <AiFillCaretLeft onClick={()=>{setCount(count-1)}} className="h-10 cursor-pointer w-10"/>
                <div className="flex flex-col justify-center">
                <h5 className="font-semibold text-xl">{count}</h5>
                </div>
                <AiFillCaretRight onClick={()=>{setCount(count+1)}} className="h-10 cursor-pointer w-10"/>
              </section>
              <div className="grid grid-cols-2 gap-[12px] mt-6">
                <h3 className="pt-3 pb-3 text-center bg-blue-600 text-slate-100 rounded">
                  Add To Cart
                </h3>
                <h3 className="pt-3 pb-3 text-center bg-blue-600 text-slate-100 rounded">
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
