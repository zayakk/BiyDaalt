"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";

// Барааны мэдээлэл
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

  // API-с бараануудыг авна
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

  // Бараа нэмэх
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newProduct = { name, description, price };

    try {
      const response = await sendRequest("http://localhost:8000/products", "POST", newProduct);
      setProducts((prev) => [...prev, response.data]); // Шинэ бараа нэмсэн тохиолдолд жагсаалтанд нэмэх
      setName("");
      setDescription("");
      setPrice(0);
    } catch (err) {
      console.error(err);
      setError("Бараа нэмэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Бараа засах
  const handleUpdateProduct = async (product: Product) => {
    setLoading(true);
    const updatedProduct = { ...product, name, description, price };

    try {
      const response = await sendRequest(`http://localhost:8000/products/${product.id}`, "PUT", updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? response.data : p))); // Хамгийн сүүлийн зассан барааг харуулах
    } catch (err) {
      console.error(err);
      setError("Бараа засахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Бараа устгах
  const handleDeleteProduct = async (productId: number) => {
    setLoading(true);

    try {
      await sendRequest(`http://localhost:8000/products/${productId}`, "DELETE");
      setProducts((prev) => prev.filter((p) => p.id !== productId)); // Устгасан барааг жагсаалтаас хасах
    } catch (err) {
      console.error(err);
      setError("Бараа устгахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Ачааллаж байна...</p>;

  return (
    <div>
      <h2>Бараа удирдлага</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddProduct}>
        <h3>Шинэ бараа нэмэх</h3>
        <div>
          <label>Нэр</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Тайлбар</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Үнэ</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Нэмэх</button>
      </form>

      <h3>Бараанууд</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span> - <span>{product.price}</span>
            <button onClick={() => handleUpdateProduct(product)}>Засах</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Устгах</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
