import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Loader from "../../Components/Loader/Loader";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import "./index.css"; // Import the SCSS stylesheet for the page

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [priceFilters, setPriceFilters] = useState({
    range1: false,
    range2: false,
    range3: false,
    range4: false,
  });

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
      setLoading(false);
    });
  }, []);

  function handleSearch(value) {
    setSearchValue(value);
  }

  function isFilterIconClicked(value) {
    if (pathname === "/") setShowModal(true);
  }

  const handlePriceFilterChange = (event) => {
    const { name, checked } = event.target;
    setPriceFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredByPricePlaces = places.filter((place) => {
    if (priceFilters.range1 && place.price >= 0 && place.price <= 999) {
      return true;
    }
    if (priceFilters.range2 && place.price >= 1000 && place.price <= 1999) {
      return true;
    }
    if (priceFilters.range3 && place.price >= 2000 && place.price <= 2999) {
      return true;
    }
    if (priceFilters.range4 && place.price >= 3000) {
      return true;
    }
    return false;
  });

  // Filter the places based on the searchValue
  const filteredPlaces = !(
    priceFilters.range1 ||
    priceFilters.range2 ||
    priceFilters.range3 ||
    priceFilters.range4
  )
    ? places.filter(
        (place) =>
          place.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          place.address.toLowerCase().includes(searchValue.toLowerCase())
      )
    : filteredByPricePlaces.filter(
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
      <Header onSearch={handleSearch} isFilterIconClick={isFilterIconClicked} />
      <div className="place-grid">
        {loading ? (
          <div className="place-loader">
            <Loader />
          </div>
        ) : currentPlaces.length > 0 ? (
          currentPlaces.map((place) => (
            <Link to={"/place/" + place._id} key={place._id} className="place-link">
              <div className="place-card">
                {place.photos?.[0] && (
                  <img
                    className="place-image"
                    src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="place-title">{place.address}</h2>
              <h3 className="place-subtitle">{place.title}</h3>
              <div className="place-price">
                <span className="place-price-text">₹{place.price} per night</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="place-not-found">
            <div className="place-not-found-box">
              <h2 className="place-not-found-title">No Places found</h2>
              <p className="place-not-found-text">Can't find places of the given price.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="place-pagination">
        {filteredPlaces.length > itemsPerPage && (
          <nav className="pagination">
            <ul className="pagination-list">
              {Array.from({
                length: Math.ceil(filteredPlaces.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index} className="pagination-item">
                  <button
                    className={`${
                      index + 1 === currentPage
                        ? "pagination-button-active"
                        : "pagination-button"
                    }`}
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
      
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        ariaHideApp={false}
        className="modal-box"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">Filter By Price</h2>
        <div className="modal-item">
          <input
            type="checkbox"
            name="range1"
            checked={priceFilters.range1}
            onChange={handlePriceFilterChange}
            className="modal-checkbox"
          />
          <label className="modal-label">₹0 - ₹999</label>
        </div>
        <div className="modal-item">
          <input
            type="checkbox"
            name="range2"
            checked={priceFilters.range2}
            onChange={handlePriceFilterChange}
            className="modal-checkbox"
          />
          <label className="modal-label">₹1000 - ₹1999</label>
        </div>
        <div className="modal-item">
          <input
            type="checkbox"
            name="range3"
            checked={priceFilters.range3}
            onChange={handlePriceFilterChange}
            className="modal-checkbox"
          />
          <label className="modal-label">₹2000 - ₹2999</label>
        </div>
        <div className="modal-item">
          <input
            type="checkbox"
            name="range4"
            checked={priceFilters.range4}
            onChange={handlePriceFilterChange}
            className="modal-checkbox"
          />
          <label className="modal-label">₹3000 and above</label>
        </div>
        <div className="modal-button">
          <button
            className="modal-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>{" "}
        </div>
      </Modal>
    </>
  );
}
