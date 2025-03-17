import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [storeData, setStoreData] = useState({ name: "", email: "", address: "" });
  const [ratingData, setRatingData] = useState({ storeId: "", rating: 5, comment: "" });
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/store/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(storeData),
      });

      if (response.ok) {
        alert("Store created successfully!");
        setShowCreateModal(false);
        setStoreData({ name: "", email: "", address: "" });
      } else {
        alert("Error creating store");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/store/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const result = await response.json();
      if (response.ok) {
        setStores(result);
        setShowStoresModal(true);
      } else {
        alert("Error fetching stores");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const handleRateStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/ratings/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        alert("Rating submitted!");
        setShowRateModal(false);
      } else {
        alert("Error submitting rating");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const fetchRatings = async (storeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ratings/${storeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const result = await response.json();
      console.log("Fetched Ratings:", result); // Debugging
  
      if (response.ok) {
        setRatings(result.ratings || result); // Handle API response format
        setShowRatingsModal(true);
      } else {
        alert("No ratings found");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to the Dashboard</h2>
      <button style={styles.button} onClick={handleLogout}>Logout</button>

      <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>Create Store</button>
      <button style={styles.createButton} onClick={fetchStores}>Get All Stores</button>

      {/* Create Store Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Create a Store</h3>
            <form onSubmit={handleCreateStore}>
              <input type="text" name="name" value={storeData.name} onChange={handleInputChange} placeholder="Store Name" required style={styles.input} />
              <input type="email" name="email" value={storeData.email} onChange={handleInputChange} placeholder="Email" required style={styles.input} />
              <input type="text" name="address" value={storeData.address} onChange={handleInputChange} placeholder="Address" required style={styles.input} />
              <button type="submit" style={styles.submitButton}>Submit</button>
              <button type="button" style={styles.cancelButton} onClick={() => setShowCreateModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Stores List Modal */}
      {showStoresModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalLarge}>
            <h3>All Stores</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      <button style={styles.rateButton} onClick={() => { setRatingData({ ...ratingData, storeId: store.id }); setShowRateModal(true); }}>Rate</button>
                      <button style={styles.viewButton} onClick={() => fetchRatings(store.id)}>View Ratings</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.cancelButton} onClick={() => setShowStoresModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Rate Store Modal */}
      {showRateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Rate Store</h3>
            <input type="number" name="rating" min="1" max="5" value={ratingData.rating} onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })} style={styles.input} />
            <input type="text" name="comment" value={ratingData.comment} onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })} placeholder="Comment" style={styles.input} />
            <button onClick={handleRateStore} style={styles.submitButton}>Submit</button>
            <button onClick={() => setShowRateModal(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}

      {/* Ratings List Modal */}
      {showRatingsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalLarge}>
            <h3>Store Ratings</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, index) => (
                  <tr key={index}>
                    <td>{r.name}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.cancelButton} onClick={() => setShowRatingsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#000",
    color: "#FFD700",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#FFD700",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#FFD700",
    color: "#000",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#FFD700",
    width: "300px",
  },
  modalLarge: {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#FFD700",
    width: "60%",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  form: {
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    color: "#FFD700",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #FFD700",
    borderRadius: "4px",
    backgroundColor: "#333",
    color: "#FFD700",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#444",
    color: "#FFD700",
    padding: "10px",
    borderBottom: "2px solid #FFD700",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #FFD700",
  },
  cancelButton: {
    backgroundColor: "#444",
    color: "#FFD700",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "15px",
  },
};

export default Dashboard;
