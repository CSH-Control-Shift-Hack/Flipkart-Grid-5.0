import React, {useEffect, useState} from "react";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";
import { useStateContext } from "../../context";

function Home() {
  const { getAllProducts , contract } = useStateContext();
  const [products, setProducts] = useState([])

    const getProducts = async () => {
    try {
        const data = await getAllProducts();
        console.log("all products: ", data)
        setProducts(data)
    } catch (e) {
      console.log("error in fetching all products")
      console.log(e);
    }
  };


  useEffect(() => {
    if(contract){
    getProducts()
    }
  }, [contract])
  


  return (
    <div>
      <Navbar />
      {/* <ProductCard/> */}
      <div className="md:pt-10 md:pb-10 pt-6 pb-6 md:pl-8 md:pr-8 sm:pl-5 sm:pr-5 pl-3 pr-3">
        <h1 className="font-semibold sm:text-4xl text-3xl text-center">
          Top Products
        </h1>
        <section className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
          {products?.map((item, i)=>{
            return(
            <ProductCard key = {i} item={item}/>
            )
          })}
        </section>
      </div>
    </div>
  );
}

export default Home;
