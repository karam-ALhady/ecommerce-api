
import { useEffect, useState } from "react";
import api from "../services/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/notifications");
            setNotifications(response.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            read_at: new Date().toISOString(),
                        }
                        : notification
                )
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to mark notification as read."
            );
        }
    };

    return (
        <main style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "20px",
        }}>
            <h2>My Notifications</h2>

            {loading && <p>Loading notifications...</p>}

            {!loading && error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {!loading && !error && notifications.length === 0 && (
                <p>You have no notifications.</p>
            )}

            {!loading && !error && notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        marginBottom: "12px",
                        background: notification.read_at
                            ? "#fff"
                            : "#eef4ff",
                    }}
                >
                    <p>
                        {notification.data?.message ||
                            "You have a new notification."}
                    </p>

                    <small>
                        {notification.created_at
                            ? new Date(notification.created_at).toLocaleString()
                            : ""}
                    </small>

                    <div style={{ marginTop: "10px" }}>
                        {notification.read_at ? (
                            <span style={{ color: "green" }}>
                                Read
                            </span>
                        ) : (
                            <button
                                onClick={() =>
                                    handleMarkAsRead(notification.id)
                                }
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </main>
    );
}

export default Notifications;
