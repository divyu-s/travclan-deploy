import React, { useState, useEffect } from "react";
import "./style.css";
import ReactPaginate from "react-paginate";
import { useStateValue } from "../../datalayer/StateProvider";

const API = `https://intense-tor-76305.herokuapp.com/merchants`;
export default function Index() {
  const [store = { customerList: [] }, dispatch] = useStateValue();
  const customersList = store.customerList;
  const [pageNumber, setPageNumber] = useState(0);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const getDataFromApi = async () => {
      const customerList = await fetch(API);
      const customerListJson = await customerList.json();
      let filterCustomerListJson = customerListJson.filter(
        (item) => item.firstname
      );
      dispatch({
        type: "ADD_CUSTOMERS",
        list: filterCustomerListJson,
      });
      //setCustomersList(filterCustomerListJson);
    };
    getDataFromApi();
  },[]);

  const getBid = (bids) => {
    //console.log(bids);
    if (bids.length === 0) {
      return 0;
    }
    if (bids.length === 1) {
      return bids[0].amount;
    }
    let copybids = bids.sort((a, b) => a.amount - b.amount);
    //console.log(copybids);
    if (flag) {
      return copybids[copybids.length - 1].amount;
    }
    if (!flag) {
      return copybids[0].amount;
    }
  };

  const visitedUser = pageNumber * 10;

  const displayData = customersList.slice(visitedUser, visitedUser + 10);

  //console.log(displayData);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleButton = () => {
    setFlag(!flag);
  };

  return (
    <div className="body">
      <div className="toggle">
        <span>
          Note: customers are listed with his {flag ? "Maximum" : "Minimum"}{" "}
          Bid.
        </span>
        <button onClick={handleButton}>
          {flag ? "Get Customer's By Min Bid" : "Get Customer's By Max Bid"}
        </button>
      </div>
      <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Premium</th>
            <th>{flag ? "Max " : "Min "} Bid</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, index) => (
            <tr key={index}>
              <td>
                <img
                  className="avater"
                  src={item.avatarUrl}
                  alt="user avater"
                />
                {" " + item.firstname + " " + item.lastname}
              </td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.hasPremium ? "Yes" : "No"}</td>
              <td>{getBid(item.bids)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(customersList.length / 10)}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
}
