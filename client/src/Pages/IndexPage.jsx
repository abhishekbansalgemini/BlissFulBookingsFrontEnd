import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link} from "react-router-dom";
import Header from "../Components/Header/Header";
import Loader from "../Components/Loader/Loader";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8; // Number of places to display per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
      setLoading(false);
    });
  }, []);

  function handleSearch(value) {
    setSearchValue(value);
  }

  // Filter the places based on the searchValue
  const filteredPlaces = places.filter(
    (place) =>
      place.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      place.address.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination
  const indexOfLastPlace = currentPage * itemsPerPage;
  const indexOfFirstPlace = indexOfLastPlace - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(
    indexOfFirstPlace,
    indexOfLastPlace
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : currentPlaces.length > 0 ? (
          currentPlaces.map((place) => (
            <Link to={"/place/" + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500 truncate">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">₹{place.price} per night</span>
              </div>
            </Link>
          ))
        ) : (
          <div>No places found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {filteredPlaces.length > itemsPerPage && (
          <nav className="pagination">
            <ul className="flex space-x-2">
              {Array.from({
                length: Math.ceil(filteredPlaces.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    className={`${
                      index + 1 === currentPage
                        ? "text-white bg-blue-500"
                        : "text-blue-500 bg-white"
                    } px-3 py-1 rounded-md`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
