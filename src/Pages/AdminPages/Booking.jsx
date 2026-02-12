import { useState, useEffect } from "react";
import { Pencil, XCircle, Download, ChevronDown, Search } from "lucide-react";
import { apiService } from "../../Services/apiService";

// Mock EditBookingModal Component
const EditBookingModal = ({
  isEditOpen,
  selectedBooking,
  closeModal,
  handleChange,
  handleSave,
}) => {
  if (!isEditOpen || !selectedBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XCircle size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Booking</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name (Read Only)
            </label>
            <input
              type="text"
              name="user"
              value={selectedBooking.user?.name || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            onClick={closeModal}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI Logic States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadBookings = async () => {
    try {
      const res = await apiService.get("/ticket/list");
      console.log("Fetched Bookings:", res);
      // Backend format is { data: [...], status: {...} }
      setBookings(res.data || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedBooking(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (data) => {
    console.log("Saving booking data:", data);
    // Modal is currently read-only for user name, so no save logic needed yet
    closeModal();
  };

  const deleteBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const res = await apiService.delete(`/ticket/delete/${id}`);
        alert(res?.status?.description || "Booking cancelled successfully!");
        loadBookings();
      } catch (error) {
        console.error("Cancel failed:", error);
        alert(
          error.response?.data?.status?.description ||
            "Failed to cancel booking.",
        );
      }
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.id.toString().includes(searchTerm) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
        <p className="text-gray-500 mt-1">
          View and manage all ticket bookings
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, user, or event..."
              className="px-5 py-2 pl-12 rounded-full border border-gray-200 bg-white shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-t-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-gray-800 font-semibold">
              <tr>
                <th className="p-4 text-left">Booking ID</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Event</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Seats</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-10 text-center text-gray-400 italic"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-600">
                      #{booking.id.toString().padStart(4, "0")}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {booking.user?.name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600 font-semibold">
                      {booking.event?.title || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {booking.event?.date
                        ? new Date(booking.event.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {booking.event?.time || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {booking.seats?.join(", ")}
                    </td>
                    <td className="p-4 text-gray-900 font-bold">
                      ${booking.price}
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(booking)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                        title="View Details"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Cancel Booking"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <EditBookingModal
        isEditOpen={isEditOpen}
        selectedBooking={selectedBooking}
        closeModal={closeModal}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </div>
  );
}
