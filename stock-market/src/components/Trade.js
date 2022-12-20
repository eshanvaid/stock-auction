import axios from "axios";
import React from "react";
import Sidebar from "./SideBar";


export default function Portfolio() {

    const [user, setUser] = React.useState("1");
    const [buysell, setBuysell] = React.useState("Buy");
    const [orderType, setOrderType] = React.useState("Market");
    const [amount, setAmount] = React.useState(null);
    const [price, setPrice] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);

    const [message, setMessage] = React.useState(null); 

    const handleSubmit = (event) => {
        event.preventDefault();
        let input = {
            user: user,
            buysell: buysell,
            orderType: orderType,
            amount: amount,
            price: price
        };
        console.log(showModal);
          axios.post('/api/place', input).then((response) => {
                console.log(response.data);
                setMessage(response.data);
                setShowModal(true);
            })
            .catch((error) => {
            console.error(error);
            });
      }

    return (
        <>
            {showModal && <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className=" text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>}
            <div className="flex">
                <Sidebar />
                <div className="mx-auto my-4 w-full lg:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <div className="pt-2 flex text-gray-600">Select User</div>
                    <select value={user} onChange={(event) => setUser(event.target.value)} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option value="1">User A</option>
                        <option value="2">User B</option>
                        <option value="3">User C</option>
                        <option value="4">User D</option>
                        <option value="5">User E</option>
                    </select>

                    <div className="pt-2 mt-4 flex text-gray-600">Buy/Sell</div>
                    <select value={buysell} onChange={(event) => setBuysell(event.target.value)} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </select>

                    <div className="pt-2 mt-4 flex text-gray-600">Order Type</div>
                    <select value={orderType} onChange={(event) => setOrderType(event.target.value)} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option value="Market">Market</option>
                        <option value="Limit">Limit</option>
                    </select>

                    
                    <div className="pt-2 mt-4 flex text-gray-600">Amount of Stocks</div>
                    <input type="number"
                        value={amount} 
                        onChange={(event) => setAmount(event.target.value)}
                        class="p-2.5 w-96 pr-20 rounded-lg z-0 border text-gray-500 focus:border-indigo-600 focus:outline-none" placeholder="Enter Amount" />

                    {orderType==="Limit" && <div>
                        <div className="pt-2 mt-4 flex text-gray-600">Limit Price</div>
                        <input type="number"
                            value={price} 
                            onChange={(event) => setPrice(event.target.value)}
                            class="p-2.5 w-96 pr-20 rounded-lg z-0 border text-gray-500 focus:border-indigo-600 focus:outline-none" placeholder="Enter Price" />

                    </div>}
                   
                   {amount!=null && (orderType==="Market" || price!=null) && 
                   <input color="blue" className="rounded-lg my-4 p-2 hover:bg-gray-900 bg-gray-800 text-white" type="submit" value="Place Order"/>
                    
                   }
                    
                    </form>
                </div>
            </div>
        </>
    );
}