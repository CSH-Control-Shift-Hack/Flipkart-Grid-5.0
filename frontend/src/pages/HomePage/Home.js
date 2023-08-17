import React, {useEffect} from "react";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";
import { useStateContext } from "../../context";

function Home() {
  const { registerSeller } = useStateContext();

    const addSeller = async () => {
    try {
        const data = await registerSeller();
        console.log(data)
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div>
      <Navbar />
      {/* <ProductCard/> */}
      <div className="md:pt-10 md:pb-10 pt-6 pb-6 md:pl-8 md:pr-8 sm:pl-5 sm:pr-5 pl-3 pr-3">
        <h1 onClick={addSeller} className="font-semibold sm:text-4xl text-3xl text-center">
          Top Products
        </h1>
        <section className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </section>
      </div>
    </div>
  );
}

export default Home;
