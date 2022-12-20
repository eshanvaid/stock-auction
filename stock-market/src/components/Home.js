import axios from "axios";
import React from "react";
import Sidebar from "./SideBar";
import StockChart from "./StockChart";

const data = {
    stockFullName: "Ethereum.",
    stockShortName: "ETH",
    price: {
      current: 0,
      open: 2.23,
      low: 2.215,
      high: 2.325,
      cap: 93765011,
      ratio: 20.1,
      dividend: 1.67,
    },
    chartData: {
      labels: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      data: [],
    },
  };
  

export default function Home() {
    const [graphData, setGraphData] = React.useState(null);
    const [history, setHistory] = React.useState(null);
    const [marketPrice, setMarketPrice] = React.useState("NA");
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        axios.post('/api/history',null).then((response) => {
            setHistory(response.data);
            if(history.length>0){
                setMarketPrice(history[0].price);
            }
            
            setInitialized(true);
        }).catch((error) => {
                console.error(error);
        });
    }); 

    React.useEffect(() => {
        if(history){
            let temp =   [];
        for (var i = history.length - 1; i >= 0; i--) {
            temp.push(history[i].price);
        }
        let obj = data;
        obj.chartData.data = temp;
        obj.price.current = marketPrice;
        setGraphData(obj);
        }
        
    },[history, initialized]);

    React.useEffect(() => {
        if(history){
            setMarketPrice(history.length>0 ? history[0].price : "NA");
        }
    },[history]);
    return (
        <>
            <div className="flex">
            <Sidebar />
            <div className="min-w-screen min-h-screen md:w-10/12  flex items-center justify-center px-5 py-5">
               {/* {initialized && <StockChart info={graphData} />} */}
            </div>
            <div className=" mx-auto my-4 rounded-lg h-full">
            <div>
            <div className='mt-8 mb-2 font-mono font-bold text-xl text-gray-800 flex mx-auto'>
                Market Price
            </div>
                <div className="shadow-md w-1/4 rounded bg-gray-800 p-4 text-white font-extrabold">${ marketPrice}</div>
            <div className='mt-8 mb-2 font-mono font-bold text-xl text-gray-800 flex mx-auto'>
                Transactions History
            </div>
            </div>
            {history &&
            <div className="overflow-x-auto">
                <div className=" w-full ">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        Buyer
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
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-100 uppercase "
                                    >
                                        Seller
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">

                                {history.map((item,id) => (
                                    <tr key={id} className="rounde">
                            
                                    <td className="px-4 py-2 text-md font-bold text-green-500 whitespace-nowrap">
                                        {item.buyer}
                                    </td>
                                    <td className="px-1 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        {item.quantity}
                                    </td>
                                    <td className="px-1 py-2 text-md font-medium text-gray-900 whitespace-nowrap">
                                        ${item.price}
                                    </td>
                                    <td className="px-4 py-2 text-md font-bold text-red-500 whitespace-nowrap">
                                        {item.seller}
                                    </td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}
            </div>
            </div>
        </>
    );
}