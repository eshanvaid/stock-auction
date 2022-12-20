import React from 'react';
import axios from 'axios';

export default function PortfolioCard({details}) {
    const userAlph = ["A", "B", "C", "D", "E"];
    const [amount, setAmount] = React.useState(null);
    const [stock, setStock] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        let input = {
            user: details.user,
            amount: (amount)?amount:details.assets,
            stocks: (stock)?stock:details.stocks
        };

        setAmount(null);
        setStock(null);
        
          axios.post('/api/portfolio/update', input).then((response) => {
              console.log("Updated");
            })
            .catch((error) => {
            console.error(error);
            });

      }


    return(
        <>
            <div className="max-w-sm mt-12 mb-4 rounded-lg overflow-hidden shadow-xl bg-white">
              <img className="w-16 mx-auto" src="\images\profile.png" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">User {userAlph[details.user -1]}</div>
                <div>
                <div className='flex mt-6'>
                <p className="mx-8 text-gray-700 text-lg font-bold">
                    Balance
                </p>
                <p className="text-green-700 font-bold text-xl">
                    ${details.assets} 
                </p>
                </div>
                <div className='flex mt-2'>
                <p className="mx-8 text-gray-700 text-lg font-bold">
                    Stocks
                </p>
                <p className="text-blue-700 font-bold text-xl flex">
                <img className="mt-2 w-4 h-4" src="\images\ethereum-eth-logo.png" />
                    {details.stocks} 
                </p>
                

                </div>
                </div>
              </div>
            </div>
            <div className=' w-full'>
                <div className=" bg-white">
                    <div className="">
                        <div className="relative"> 
                                <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
                        <form onSubmit={handleSubmit}>
                        <input type="number"
                        value={amount} 
                        onChange={(event) => setAmount(event.target.value)}
                        className="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Enter Balance" />
                            </form>
                        </div>
                    </div>
                </div>

            <div className="mt-4 bg-white">
            <div className="container flex">
                <div className="relative"> 
                        <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
                <form onSubmit={handleSubmit}>
                <input type="number"
                 value={stock} 
                 onChange={(event) => setStock(event.target.value)}
                 className="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Enter Stocks" />
                    <div className='mt-4'>
                        
                        <button
                        type='submit'
                        className="h-10 w-24 text-white rounded-lg text-sm hover:bg-gray-900 bg-gray-800">Update</button>
                        
                    </div>
                    </form>
                </div>
            </div>
            
            </div>
           
            </div>
           
        </>
    );
}
