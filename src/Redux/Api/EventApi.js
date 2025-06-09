import axiosInstance from "../axiosInstance";

const eventAPIs = {

  getAllEvents: () =>{
    return axiosInstance.get("/management/events/")},

  addEvent: (newEvent) => axiosInstance.post("/management/events/", newEvent),

  updateEvent: (id, updatedEvent) => axiosInstance.put(`/management/events/${id}/`, updatedEvent),



//   // Edit a specific book by ID
//   editBook: (id, bookData) => axiosInstance.put(`/books/${id}/`, bookData),

//   // Delete a book by ID
//   deleteBook: (id) => axiosInstance.delete(`/books/${id}/`),
};

export default eventAPIs;
