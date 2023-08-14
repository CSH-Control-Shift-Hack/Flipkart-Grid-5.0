import React from "react";
import Navbar from "../../components/Navbar";

function ProductDetails() {
  return (
    <div>
      <Navbar />
      <section className="flex min-h-[95vh] flex-col justify-center pt-10 pb-10 xl:pl-24 xl:pr-24 lg:pl-16 lg:pr-16 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">
        <div className="flex gap-[25px] rounded border-[2px] border-slate-500 p-4">
          <img
            src={
              "https://cdn.pixabay.com/photo/2023/05/15/08/52/flower-7994489_1280.jpg"
            }
            className="h-full lg:min-h-[450px] w-1/2 rounded"
          />
          <section className="w-1/2 flex flex-col justify-between">
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
              <h3 className="font-semibold text-2xl mt-2">20 MATIC (4 FLIPS can be used)</h3>
            </div>
            <div className="grid grid-cols-2 gap-[12px] mt-6">
                <h3 className="pt-3 pb-3 text-center bg-blue-600 text-slate-100 rounded">Add To Cart</h3>
                <h3 className="pt-3 pb-3 text-center bg-blue-600 text-slate-100 rounded">Buy Now</h3>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
