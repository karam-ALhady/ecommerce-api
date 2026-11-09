
import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/orders", {
                    params: { page: currentPage },
                });

                setOrders(response.data.data || []);
                setLastPage(response.data.last_page || 1);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Please login to view your orders.");
                } else {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load orders."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    return (
        <main style={{
            maxWidth: "1000px",
            margin: "40px auto",
            padding: "20px",
        }}>
            <h2>My Orders</h2>
            <p>View your previous orders and their details.</p>

            {loading && <p>Loading orders...</p>}

            {!loading && error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {!loading && !error && orders.length === 0 && (
                <p>You have not placed any orders yet.</p>
            )}

            {!loading && !error && orders.map((order) => (
                <section
                    key={order.id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3>Order #{order.id}</h3>

                    <p>
                        <strong>Date:</strong>{" "}
                        {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "N/A"}
                    </p>

                    <p>
                        <strong>Status:</strong> {order.status}
                    </p>

                    <p>
                        <strong>Total:</strong> $
                        {Number(order.total_price).toFixed(2)}
                    </p>

                    <h4>Order Items</h4>

                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                padding: "10px",
                                borderTop: "1px solid #eee",
                            }}
                        >
                            <p>
                                <strong>
                                    {item.product?.name || "Product"}
                                </strong>
                            </p>

                            <p>Quantity: {item.quantity}</p>

                            <p>
                                Price: $
                                {Number(item.price).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </section>
            ))}

            {!loading && !error && orders.length > 0 && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                }}>
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {currentPage} of {lastPage}
                    </span>

                    <button
                        disabled={currentPage >= lastPage}
                        onClick={() => setCurrentPage((page) => page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}

export default Orders;
