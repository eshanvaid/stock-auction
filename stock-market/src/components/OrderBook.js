import axios from 'axios';
import React from 'react';
import Sidebar from './SideBar';

export default function OrderBook() {
    const [sellOrders, setSellOrders] = React.useState(null);
    const [buyOrders, setBuyOrders] = React.useState(null);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        axios.post('/api/orderbook',null).then((response) => {
            setBuyOrders(response.data.buyOrders);
            setSellOrders(response.data.sellOrders);
            setInitialized(true);
        }).catch((error) => {
                console.error(error);
        });
    },[initialized] );   

    return(
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col mx-auto">
            <div className='mt-8 mb-2 font-mono font-bold text-xl text-gray-800 flex mx-auto'>
            <div className='font-thin text-green-500 mr-2'>Buy  </div> Orders
            </div>
            {buyOrders &&
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full ">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        User
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        
                                        
                                        Price
                                    </th>
                                   
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">

                                {buyOrders.slice(0).reverse().map((item,id) => (
                                    <tr key={id} >
                            
                                    <td className="px-2 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        {item.user}
                                    </td>
                                    <td className="px-1 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        {item.quantity}
                                    </td>
                                    <td className="px-2 py-2 text-md font-bold text-green-500 whitespace-nowrap">
                                        {item.price}
                                    </td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}
        </div>

        <div className="flex flex-col">
        <div className='mt-8 mb-2 font-mono font-bold text-xl text-gray-800 flex ml-16'>
            <div className='font-thin text-red-500 mr-2'>Sell  </div> Orders
            </div>
            {sellOrders &&
            <div className="overflow-x-auto mr-48">
                <div className="p-1.5 w-full ">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        Price
                                        
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        
                                        User
                                        
                                    </th>
                                   
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {sellOrders.slice(0).reverse().map((item,id) => (
                                    <tr key={id} >
                            
                                    <td className="px-2 py-2 text-md font-bold text-red-500 whitespace-nowrap">
                                        {item.price}
                                    </td>
                                    <td className="px-1 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        {item.quantity}
                                    </td>
                                    <td className="px-2 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        {item.user}
                                    </td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            }
        </div>
            </div>
        </>
    )
}