import React from "react";
import Navbar from "../../components/Navbar";

function UploadProduct() {
  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex flex-col justify-center min-h-[80vh] 2xl:pl-96 2xl:pr-96 xl:pl-64 xl:pr-64 lg:pl-44 lg:pr-44 md:pl-28 md:pr-28 sm:pl-10 sm:pr-10 pl-2 pr-2 pt-16 pb-16">
        <h2 className="font-semibold sm:text-2xl xs:text-xl text-lg">
          Add A Product
        </h2>
        <form className="mt-3">
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
          <button
            type="submit"
            className="pt-3 pb-3 cursor-pointer mt-7 mb-5 w-[100px] text-center text-slate-100 rounded bg-[#3857df]"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadProduct;
