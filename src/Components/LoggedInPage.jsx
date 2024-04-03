import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { Card, Button, Modal, Form, Carousel } from "react-bootstrap";
import "./Styles/LoggedInPage.css"; // Import the CSS file

const LoggedInPage = ({ userEmail }) => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    destination: "",
    date: "",
    notes: "",
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [destinationImage, setDestinationImage] = useState(null); // Store the destination image URL

  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    }
  }, [userEmail]);

  const fetchBookings = async () => {
    if (userEmail) {
      try {
        const response = await axios.get(
          "https://nodejs-day-5-task-backend-ameu.onrender.com/Users/bookings",
          {
            params: {
              userEmail: userEmail,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        console.error("Error message:", error.message);
        console.error("Error status code:", error.response?.status);
        console.error("Error response data:", error.response?.data);
      }
    } else {
      console.error("User email not provided");
    }
  };

  const handleBookTrip = async () => {
    try {
      // Fetch destination image based on the booking data
      const destinationImageUrl = `https://source.unsplash.com/featured/?${bookingData.destination}`;
      setDestinationImage(destinationImageUrl);

      const response = await axios.post(
        "https://nodejs-day-5-task-backend-ameu.onrender.com/Users/bookTrip",
        { ...bookingData, name, email, phoneNumber }
      );
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error booking trip:", error);
    }
  };

  const handleEditTrip = async () => {
    try {
      const response = await axios.put(
        `https://nodejs-day-5-task-backend-ameu.onrender.com/Users/bookings/${selectedTrip._id}`,
        { ...bookingData, name, email, phoneNumber }
      );
      setShowEditModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error editing trip:", error);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      const response = await axios.delete(
        `https://nodejs-day-5-task-backend-ameu.onrender.com/Users/bookings/${selectedTrip._id}`
      );
      setShowDeleteModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleEditModalOpen = (trip) => {
    setSelectedTrip(trip);
    setBookingData({
      name: trip.name,
      destination: trip.destination,
      date: trip.date,
      notes: trip.notes || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteModalOpen = (trip) => {
    setSelectedTrip(trip);
    setShowDeleteModal(true);
  };
  const handleLogout = () => {
    // Clear user authentication data (e.g., token)
    localStorage.removeItem("token"); // Assuming token is stored in localStorage

    // Redirect the user to the login page
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="container mt-5 logged-in-page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to Travel Booking Portal!</h1>
        <div className="d-flex align-items-end">
          <Button
            variant="danger"
            onClick={handleLogout}
            className="py-2"
            style={{ width: "120px", height: "40px", marginRight: "10px" }}
          >
            Logout
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="py-2"
            onClick={() => setShowModal(true)}
            style={{ width: "150px", height: "40px" }}
          >
            Book a Trip
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Card className="custom-card booking-information mt-4 py-2">
            {" "}
            {/* Apply custom card class */}
            <Card.Header as="h4">Upcoming Bookings !!</Card.Header>
            <Card.Body>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <div key={index} className="booking-details">
                    <div className="fw-bold">Name: {booking.name}</div>
                    <div>Destination: {booking.destination}</div>
                    <div>Date: {booking.date}</div>
                    <div className="button-group mt-3">
                      {" "}
                      {/* Apply button group class */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditModalOpen(booking)}
                      >
                        Edit Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteModalOpen(booking)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No upcoming bookings.</p>
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="random-image-card">
            {" "}
            {/* Apply random image card class */}
            <Card.Body>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 random-image"
                    src={
                      destinationImage
                        ? destinationImage
                        : "https://source.unsplash.com/featured/?travel"
                    }
                    alt="Destination"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 random-image"
                    src={
                      destinationImage
                        ? destinationImage
                        : "https://source.unsplash.com/featured/?beach"
                    }
                    alt="Destination"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 random-image"
                    src={
                      destinationImage
                        ? destinationImage
                        : "https://source.unsplash.com/featured/?mountain"
                    }
                    alt="Destination"
                  />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="booking-modal-header">
          {" "}
          {/* Apply booking modal header class */}
          <Modal.Title>Book a Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body className="booking-modal-content">
          {" "}
          {/* Apply booking modal content class */}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="destination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter destination"
                name="destination"
                value={bookingData.destination}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notes (optional)"
                name="notes"
                value={bookingData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="booking-modal-footer">
          {" "}
          {/* Apply booking modal footer class */}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBookTrip}>
            Book Trip
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="edit-delete-modal-header">
          {" "}
          {/* Apply edit-delete modal header class */}
          <Modal.Title>Edit Trip Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-delete-modal-content">
          {" "}
          {/* Apply edit-delete modal content class */}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="destination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter destination"
                name="destination"
                value={bookingData.destination}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
                value={bookingData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notes (optional)"
                name="notes"
                value={bookingData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="edit-delete-modal-footer">
          {" "}
          {/* Apply edit-delete modal footer class */}
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTrip}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="edit-delete-modal-header">
          {" "}
          {/* Apply edit-delete modal header class */}
          <Modal.Title>Delete Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-delete-modal-content">
          {" "}
          {/* Apply edit-delete modal content class */}
          <p>Are you sure you want to delete this trip?</p>
        </Modal.Body>
        <Modal.Footer className="edit-delete-modal-footer">
          {" "}
          {/* Apply edit-delete modal footer class */}
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTrip}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoggedInPage;
