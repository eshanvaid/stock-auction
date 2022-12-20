import { Button } from "@material-tailwind/react";
import React from "react";
import Sidebar from "./SideBar";
import axios from 'axios';
import PortfolioCard from "./PortfolioCard";

export default function Portfolio() {

    const [data, setData] = React.useState(null);
    const [user, setUser] = React.useState("1");

    const handleChange = (event) => {
        setUser(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let input = {
            user: user
        };
        
          axios.post('/api/portfolio', input).then((response) => {

              setData(response.data);
            })
            .catch((error) => {
            console.error(error);
            });
            console.log(data);
      }


    return (
        <>
        <div className="flex">
        <Sidebar />
        <div className="mx-auto my-4 w-full lg:max-w-sm">
            <form onSubmit={handleSubmit}>
            <label>
            <div className="py-2 text-gray-600">Select User</div>
            <select value={user} onChange={handleChange} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                {/* <option value={0}>Select User</option> */}
                <option value="1">User A</option>
                <option value="2">User B</option>
                <option value="3">User C</option>
                <option value="4">User D</option>
                <option value="5">User E</option>
            </select>
            <input color="blue" className="rounded-lg my-4 p-2 hover:bg-gray-900 bg-gray-800 text-white" type="submit" value="Get Portfolio"/>
            </label>
            </form>
            {data!=null &&
                <div>
                <PortfolioCard details = {data} />
                </div>
            }
            {/* {data!=null && <PortfolioCard details = {data} />} */}
        </div>
        </div>
    </>
    );
}
