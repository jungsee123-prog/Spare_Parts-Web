import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* 🔴 여기만 나중에 바꿉니다 */
const supabase = createClient(
  "https://tgkwhchuoxuvitnsaqjo.supabase.co",
  "sb_publishable_EhWgQhfjCTAdrWTQRUPYKg_c-UU2m2y"
);

export default function SparePartsApp() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    qty: "",
    location: "",
  });

  // DB에서 목록 불러오기
  const fetchItems = async () => {
    const { data } = await supabase
      .from("Spare_Parts")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 재고 입력
  const addItem = async () => {
    if (!form.name || !form.qty) return;

    await supabase.from("Spare_Parts").insert([
      {
        name: form.name,
        qty: Number(form.qty),
        location: form.location,
      },
    ]);

    setForm({ name: "", qty: "", location: "" });
    fetchItems();
  };

  const filtered = items.filter((i) =>
    i.name.includes(search)
  );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>예비품 재고 관리</h1>

      <h3>🔍 예비품 검색</h3>
      <input
        style={{ width: "100%", padding: "8px" }}
        placeholder="예: 모노펌프"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />

      <h3>➕ 재고 입력 (입고)</h3>
      <input
        style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        placeholder="예비품명"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        placeholder="수량"
        value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })}
      />
      <input
        style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        placeholder="보관 위치 (예: 반입장)"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <button onClick={addItem}>저장</button>

      <hr />

      <h3>📋 재고 목록</h3>
      <table border="1" width="100%" cellPadding="5">
        <thead>
          <tr>
            <th>예비품</th>
            <th>수량</th>
            <th>위치</th>
            <th>입력일</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td style={{ textAlign: "center" }}>{i.qty}</td>
              <td>{i.location}</td>
              <td>{i.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
