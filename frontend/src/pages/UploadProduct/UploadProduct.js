import React , {useState} from "react";
import Navbar from "../../components/Navbar";
import axios from 'axios'
import { useStateContext } from "../../context";

function UploadProduct() {

  // const [file1,setFile1] = useState();

  // const handle = async() => {
  //   const res = await axios({
  //     method: "post",
  //     url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //     data: file1,
  //     headers:{
  //       pinata_api_key: '387124cacf45844a6a47',
  //       pinata_secret_api_key: '92eca9357b0104480c8a2b55f29afa3837f28e196c113f0e047650cea9bc4554',
  //       "Content-Type":"multipart/form-data"
  //     }
  //   })

  //   console.log(res)
  // }

  const { addProduct } = useStateContext();

    const addAProduct = async () => {
    try {
        const data = await addProduct('MAt', 10, 20, 3, 3, 'https://cdn.pixabay.com/photo/2023/08/05/13/32/hummingbird-8171118_640.jpg');
        console.log(data)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex flex-col justify-center min-h-[80vh] 2xl:pl-96 2xl:pr-96 xl:pl-64 xl:pr-64 lg:pl-44 lg:pr-44 md:pl-28 md:pr-28 sm:pl-10 sm:pr-10 pl-2 pr-2 pt-16 pb-16">
        <h2 className="font-semibold sm:text-2xl xs:text-xl text-lg">
          Add A Product
        </h2>
        <div className="mt-3">
          <h4 className="font-semibold mb-1 mt-5">Product Name* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="text"
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a name for your product *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Image* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="file"
              // onChange={(e)=>{
              //   if(e.target.files){
              //       setFile1(e.target.files[0]);
              //   }
              // }}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="EUpload an image for your product *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Price* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="number"
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a price for your product *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Price* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <textarea
            rows={4}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a short description for your product *"
            />
          </div>
          <h3
            onClick={addAProduct}
            className="pt-3 pb-3 cursor-pointer mt-7 mb-5 w-[100px] text-center text-slate-100 rounded bg-[#3857df]"
          >
            Create
          </h3>
        </div>
      </div>
    </div>
  );
}

export default UploadProduct;
