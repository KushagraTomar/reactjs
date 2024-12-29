
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://13.201.194.168:3001/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://13.201.194.168:3001/item/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("http://13.201.194.168:3001/items", form);
      }
      setForm({ name: "", description: "", price: "" });
      fetchItems();
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://13.201.194.168:3001/item/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Item Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"} Item</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: "10px" }}>
            <strong>{item.name}</strong> - {item.description} - ${item.price}
            <button onClick={() => handleEdit(item)} style={{ marginLeft: "10px" }}>Edit</button>
            <button onClick={() => handleDelete(item._id)} style={{ marginLeft: "10px" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
