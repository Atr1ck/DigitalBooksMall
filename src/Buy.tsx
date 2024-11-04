import { useCartStore } from "./Cart";
import { TopBar } from "./Home";
import { useState } from "react";

function Information() {3
  const totalprice = useCartStore((state: any) => state.totalprice);
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Telephone:", telephone);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center relative top-5 w-1/3 h-3/4 border-2 rounded-xl bg-gray-800 border-gray-600">
        <form onSubmit={handleSubmit} className="m-5 space-y-4">
          <div>
            <label className="text-white block mb-1">Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-2 py-1 rounded bg-gray-700 text-white border border-gray-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-white block mb-1">Telephone:</label>
            <input 
              type="tel" 
              value={telephone} 
              onChange={(e) => setTelephone(e.target.value)} 
              className="w-full px-2 py-1 rounded bg-gray-700 text-white border border-gray-500"
              placeholder="Enter your telephone number"
            />
          </div>
          <div className="text-white text-center text-lg mt-4">
            Total Price: $ {totalprice}
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Buy(){

    return (
      <div>
        <TopBar />
        <Information></Information>
      </div>
    )
}