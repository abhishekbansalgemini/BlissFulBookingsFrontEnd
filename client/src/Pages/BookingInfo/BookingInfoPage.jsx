import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./bookk.css"; // Import the SCSS stylesheet

export default function BookingInfoPage() {
  const { id } = useParams();
  const [bookingInfo, setBookingInfo] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const getBookingInfo = async () => {
      try {
        const response = await axios.get("/booking-info/" + id);
        setBookingInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBookingInfo();
  }, [id]);

  function handleSearch(value) {
    setSearchValue(value);
  }

  async function handleCancelBooking(id) {
    try {
      const response = await axios.delete("/adminCancelBooking/" + id);
      if (response) {
        setBookingInfo((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      }
    } catch (err) {}
  }

  return (
    <div className="container">
      <Header onSearch={handleSearch} />

      {bookingInfo.length === 0 && (
        <div className="no-bookings">
          <h2>No Bookings Found...</h2>
        </div>
      )}
      {bookingInfo.length !== 0 && (
        <div className="booking-grid">
          {bookingInfo.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-details">
                <span className="booking-details-title">Booking Details</span>
              </div>
              <div>
                <span className="booking-details-title">Name:</span>{" "}
                <span>{booking.name}</span>
              </div>
              <div>
                <span className="booking-details-title">Email:</span>{" "}
                <span>{booking.email}</span>
              </div>
              <div>
                <span className="booking-details-title">Phone:</span>{" "}
                <span>{booking.phone}</span>
              </div>
              <div>
                <span className="booking-details-title">Number of Guests:</span>{" "}
                <span>{booking.guests}</span>
              </div>
              <div>
                <span className="booking-details-title">CheckIn:</span>{" "}
                <span>{booking.checkIn.substring(0, 10)}</span>
              </div>
              <div>
                <span className="booking-details-title">CheckOut:</span>{" "}
                <span>{booking.checkOut.substring(0, 10)}</span>
              </div>
              <div className="booking-cancel-button">
                <button
                  onClick={() => {
                    handleCancelBooking(booking._id);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
