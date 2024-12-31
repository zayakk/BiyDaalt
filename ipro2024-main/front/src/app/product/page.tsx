"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await sendRequest("http://localhost:8000/products", "GET");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError("Бараануудыг ачаалж чадсангүй.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const newProduct = { name, description, price };
  
    try {
      const response = await sendRequest("http://localhost:8000/products", "POST", newProduct);
      console.log("Амжилттай нэмэгдлээ:", response); // Хариу
      setProducts((prev) => [...prev, response.data]);
      setName("");
      setDescription("");
      setPrice(0);
    } catch (err) {
      console.error("Бараа нэмэхэд алдаа гарлаа:", err);  // Алдааг шалгах
      setError("Бараа нэмэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleUpdateProduct = async (product: Product) => {
    setLoading(true);
    const updatedProduct = { ...product, name, description, price };

    try {
      const response = await sendRequest(`http://localhost:8000/products/${product.id}`, "PUT", updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? response.data : p)));
    } catch (err) {
      console.error(err);
      setError("Бараа засахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    setLoading(true);

    try {
      await sendRequest(`http://localhost:8000/products/${productId}`, "DELETE");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error(err);
      setError("Бараа устгахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p > Ачааллаж байна...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "hotpink", fontSize: "36px", fontWeight: "bold", marginBottom: "20px" }}>Бараа удирдлага</h2>
      {error && <p style={{ color: "red", fontWeight: "bold", fontSize: "16px", marginBottom: "20px" }}>{error}</p>}

      <form
        onSubmit={handleAddProduct}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "350px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(238, 30, 127, 0.1)",
        }}
      >
        <h3 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>Шинэ бараа нэмэх</h3>
        <div>
          <label style={{ fontSize: "16px", color: "#333" }}>Нэр</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              margin: "5px 0",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "16px", color: "#333" }}>Тайлбар</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              margin: "5px 0",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "16px", color: "#333" }}>Үнэ</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              margin: "5px 0",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "hotpink",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Нэмэх
        </button>
      </form>

      <h3 style={{ marginTop: "40px", color: "#333", fontSize: "24px" }}>Бараанууд</h3>
      <ul style={{ listStyle: "none", padding: "0", width: "350px" }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {product.name} - {product.price}₮
            </span>
            <div>
              <button
                onClick={() => handleUpdateProduct(product)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#008CBA",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                  transition: "background-color 0.3s ease",
                }}
              >
                Засах
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Устгах
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
