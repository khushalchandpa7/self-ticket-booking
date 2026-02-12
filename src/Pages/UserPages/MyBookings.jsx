import { useState, useEffect } from "react";
import { apiService } from "../../Services/apiService";
import { Ticket, Calendar, MapPin, Armchair } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("authData"));
      return user?.id;
    } catch (e) {
      return null;
    }
  };

  const userId = getUserId();

  const loadBookings = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // Using filter endpoint to get tickets for this user
      const response = await apiService.post("/ticket/filter", {
        filter: { userId: userId, softDelete: false },
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userId]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await apiService.delete(`/ticket/delete/${id}`);
        alert(
          response?.status?.description || "Booking cancelled successfully!",
        );
        loadBookings();
      } catch (error) {
        console.error("Cancellation failed", error);
        alert(
          error.response?.data?.status?.description ||
            "Failed to cancel booking.",
        );
      }
    }
  };

  if (loading)
    return <div className="p-10 text-gray-500">Loading your bookings...</div>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Ticket className="text-green-500" /> My Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border shadow-sm">
          <p className="text-gray-500 mb-4">
            You haven't booked any tickets yet.
          </p>
          <a
            href="/user/event"
            className="text-green-500 font-semibold hover:underline"
          >
            Browse events
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="bg-green-500 p-6 flex flex-col justify-center items-center text-white sm:w-1/4 min-h-[150px]">
                <Ticket size={32} />
                <span className="text-xs mt-2 uppercase tracking-widest font-bold">
                  Ticket
                </span>
                <span className="text-sm font-mono mt-1">
                  #{booking.id.toString().padStart(4, "0")}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">
                      {booking.event?.title || "Event Name"}
                    </h3>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-xs bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition border border-red-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-1">
                    {booking.event?.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-green-500" />
                      {booking.event?.date
                        ? new Date(booking.event.date).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Armchair size={16} className="text-green-500" />
                      {booking.seats?.length} Seats ({booking.seats?.join(", ")}
                      )
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-xs text-gray-400 block uppercase">
                      Price Paid
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${booking.price}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
