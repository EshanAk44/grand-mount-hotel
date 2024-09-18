import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                const allBookings = response.bookingList;
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, bookings]);

    const filterBookings = (term) => {
        if (term === '') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter((booking) =>
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="bookings-container">
        <h2 className='h2'>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{ marginRight: "10px" }}
          />
          All Bookings
        </h2>

        <div className="search-div">
          <label>Filter by Booking Code:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter booking code"
          />
        </div>

        <div className="booking-results">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="booking-result-item">
              <p>
                <strong>Booking Code:</strong> {booking.bookingConfirmationCode}
              </p>
              <p>
                <strong>Check In Date:</strong> {booking.checkInDate}
              </p>
              <p>
                <strong>Check out Date:</strong> {booking.checkOutDate}
              </p>
              <p>
                <strong>Total Guests:</strong> {booking.totalNumOfGuest}
              </p>
              <button
                className="edit-room-button"
                onClick={() =>
                  navigate(
                    `/admin/edit-booking/${booking.bookingConfirmationCode}`
                  )
                }
              >
                Manage Booking
              </button>
            </div>
          ))}
        </div>

        <Pagination
          roomsPerPage={bookingsPerPage}
          totalRooms={filteredBookings.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    );
};

export default ManageBookingsPage;