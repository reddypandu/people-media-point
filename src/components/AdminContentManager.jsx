import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

const emptyBreaking = { title: "", link_url: "", is_active: true };
const emptyAd = {
  title: "",
  image_url: "",
  image_storage_path: "",
  link_url: "",
  alt_text: "",
  display_order: 0,
  is_active: true,
};

const AdminContentManager = () => {
  const [breakingItems, setBreakingItems] = useState([]);
  const [ads, setAds] = useState([]);
  const [breakingForm, setBreakingForm] = useState(emptyBreaking);
  const [adForm, setAdForm] = useState(emptyAd);
  const [editingBreakingId, setEditingBreakingId] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);
  const [uploadingAdImage, setUploadingAdImage] = useState(false);
  const [message, setMessage] = useState("");

  const loadContent = async () => {
    const [breakingResult, adResult] = await Promise.all([
      supabase
        .from("breaking_news")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("sidebar_ads")
        .select("*")
        .order("display_order")
        .order("created_at", { ascending: false }),
    ]);
    if (!breakingResult.error) setBreakingItems(breakingResult.data || []);
    if (!adResult.error) setAds(adResult.data || []);
  };

  useEffect(() => {
    loadContent();
  }, []);
  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const saveBreaking = async (event) => {
    event.preventDefault();
    const payload = editingBreakingId
      ? breakingForm
      : {
          ...breakingForm,
          is_expiring: true,
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        };
    const result = editingBreakingId
      ? await supabase
          .from("breaking_news")
          .update(payload)
          .eq("id", editingBreakingId)
      : await supabase.from("breaking_news").insert([payload]);
    if (result.error)
      return notify(`Could not save breaking news: ${result.error.message}`);
    setBreakingForm(emptyBreaking);
    setEditingBreakingId(null);
    notify("Breaking news saved.");
    loadContent();
  };

  const saveAd = async (event) => {
    event.preventDefault();
    if (!adForm.image_url.trim()) {
      return notify("Add an image URL or upload a banner image first.");
    }
    const payload = {
      ...adForm,
      display_order: Number(adForm.display_order) || 0,
      ...(editingAdId
        ? {}
        : {
            is_expiring: true,
            expires_at: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          }),
    };
    const result = editingAdId
      ? await supabase.from("sidebar_ads").update(payload).eq("id", editingAdId)
      : await supabase.from("sidebar_ads").insert([payload]);
    if (result.error)
      return notify(`Could not save banner ad: ${result.error.message}`);
    setAdForm(emptyAd);
    setEditingAdId(null);
    notify("Banner ad saved.");
    loadContent();
  };

  const handleAdImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return notify("Please select an image file.");
    }

    setUploadingAdImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `sidebar-ads/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("news-images").getPublicUrl(filePath);
      setAdForm((previous) => ({
        ...previous,
        image_url: publicUrl,
        image_storage_path: filePath,
      }));
      notify("Banner image uploaded.");
    } catch (error) {
      notify(`Image upload failed: ${error.message}`);
    } finally {
      setUploadingAdImage(false);
    }
  };

  const removeStoredAdImage = async (imagePath) => {
    if (!imagePath) return;
    const { error } = await supabase.storage
      .from("news-images")
      .remove([imagePath]);
    if (error) console.warn("Ad image cleanup warning:", error.message);
  };

  const removeItem = async (table, id) => {
    if (!window.confirm("Delete this item?")) return;
    if (table === "sidebar_ads") {
      const { data: ad } = await supabase
        .from("sidebar_ads")
        .select("image_storage_path")
        .eq("id", id)
        .maybeSingle();
      await removeStoredAdImage(ad?.image_storage_path);
    }
    const { error } = await supabase.from(table).delete().eq("id", id);
    notify(error ? `Could not delete: ${error.message}` : "Item deleted.");
    if (!error) loadContent();
  };

  return (
    <section className="content-manager">
      <div className="manager-heading">
        <div>
          <h2>Breaking News & Banner Ads</h2>
          <p>Manage the header ticker and the homepage right-side banner.</p>
        </div>
        {message && <span className="manager-message">{message}</span>}
      </div>
      <div className="manager-grid">
        <div className="manager-card">
          <h3>
            {editingBreakingId ? "Edit breaking news" : "Add breaking news"}
          </h3>
          <form onSubmit={saveBreaking}>
            <input
              required
              placeholder="Breaking news headline"
              value={breakingForm.title}
              onChange={(e) =>
                setBreakingForm({ ...breakingForm, title: e.target.value })
              }
            />
            <input
              type="url"
              placeholder="Optional link URL"
              value={breakingForm.link_url || ""}
              onChange={(e) =>
                setBreakingForm({ ...breakingForm, link_url: e.target.value })
              }
            />
            <label className="check">
              <input
                type="checkbox"
                checked={breakingForm.is_active}
                onChange={(e) =>
                  setBreakingForm({
                    ...breakingForm,
                    is_active: e.target.checked,
                  })
                }
              />{" "}
              Show in ticker
            </label>
            <div className="form-actions">
              <button type="submit">
                {editingBreakingId
                  ? "Update breaking news"
                  : "Add breaking news"}
              </button>
              {editingBreakingId && (
                <button
                  type="button"
                  className="muted"
                  onClick={() => {
                    setEditingBreakingId(null);
                    setBreakingForm(emptyBreaking);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="item-list">
            {breakingItems.map((item) => (
              <div className="list-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.is_active ? "Live" : "Hidden"}</small>
                </div>
                <span>
                  <button
                    onClick={() => {
                      setEditingBreakingId(item.id);
                      setBreakingForm({
                        title: item.title,
                        link_url: item.link_url || "",
                        is_active: item.is_active,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => removeItem("breaking_news", item.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="manager-card">
          <h3>
            {editingAdId ? "Edit sidebar banner ad" : "Add sidebar banner ad"}
          </h3>
          <form onSubmit={saveAd}>
            <input
              required
              placeholder="Ad title (admin only)"
              value={adForm.title}
              onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
            />
            <input
              type="url"
              placeholder="Banner image URL (or upload below)"
              value={adForm.image_url}
              onChange={(e) =>
                setAdForm({ ...adForm, image_url: e.target.value })
              }
            />
            <label className="upload-field">
              <span>Upload banner image to Supabase Storage</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAdImageUpload(e.target.files[0])}
                disabled={uploadingAdImage}
              />
              {uploadingAdImage && <small>Uploading image...</small>}
            </label>
            <input
              type="url"
              placeholder="Click-through URL (optional)"
              value={adForm.link_url || ""}
              onChange={(e) =>
                setAdForm({ ...adForm, link_url: e.target.value })
              }
            />
            <input
              placeholder="Image alt text (optional)"
              value={adForm.alt_text || ""}
              onChange={(e) =>
                setAdForm({ ...adForm, alt_text: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Display order"
              value={adForm.display_order}
              onChange={(e) =>
                setAdForm({ ...adForm, display_order: e.target.value })
              }
            />
            <label className="check">
              <input
                type="checkbox"
                checked={adForm.is_active}
                onChange={(e) =>
                  setAdForm({ ...adForm, is_active: e.target.checked })
                }
              />{" "}
              Show this ad
            </label>
            <div className="form-actions">
              <button type="submit">
                {editingAdId ? "Update banner ad" : "Add banner ad"}
              </button>
              {editingAdId && (
                <button
                  type="button"
                  className="muted"
                  onClick={() => {
                    setEditingAdId(null);
                    setAdForm(emptyAd);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="item-list">
            {ads.map((ad) => (
              <div className="list-item ad-item" key={ad.id}>
                <img src={ad.image_url} alt="" />
                <div>
                  <strong>{ad.title}</strong>
                  <small>
                    {ad.is_active
                      ? `Live · order ${ad.display_order}`
                      : "Hidden"}
                  </small>
                </div>
                <span>
                  <button
                    onClick={() => {
                      setEditingAdId(ad.id);
                      setAdForm({
                        title: ad.title,
                        image_url: ad.image_url,
                        image_storage_path: ad.image_storage_path || "",
                        link_url: ad.link_url || "",
                        alt_text: ad.alt_text || "",
                        display_order: ad.display_order,
                        is_active: ad.is_active,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => removeItem("sidebar_ads", ad.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .content-manager {
          margin-bottom: 2rem;
        }
        .manager-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .manager-heading h2 {
          color: #001d3d;
          margin: 0;
          font-size: 1.35rem;
        }
        .manager-heading p {
          color: #64748b;
          margin: 0.25rem 0 0;
        }
        .manager-message {
          color: #166534;
          background: #dcfce7;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        .manager-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .manager-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.25rem;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
        }
        .manager-card h3 {
          margin: 0 0 1rem;
          color: #0a192f;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        input {
          padding: 0.65rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font: inherit;
        }
        .check {
          font-size: 0.88rem;
          color: #475569;
        }
        .form-actions {
          display: flex;
          gap: 0.5rem;
        }
        button {
          border: 0;
          background: #001d3d;
          color: #fff;
          padding: 0.55rem 0.8rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
        }
        button.muted {
          background: #64748b;
        }
        .item-list {
          margin-top: 1.1rem;
          border-top: 1px solid #e2e8f0;
        }
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eef2f7;
        }
        .list-item div {
          min-width: 0;
        }
        .list-item strong {
          display: block;
          font-size: 0.88rem;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        small {
          color: #64748b;
          font-size: 0.75rem;
        }
        .list-item span {
          display: flex;
          gap: 0.35rem;
        }
        .list-item button {
          font-size: 0.72rem;
          padding: 0.35rem 0.5rem;
        }
        .list-item .danger {
          background: #dc2626;
        }
        .ad-item img {
          width: 54px;
          height: 38px;
          object-fit: cover;
          border-radius: 4px;
        }
        @media (max-width: 800px) {
          .manager-grid {
            grid-template-columns: 1fr;
          }
          .manager-heading {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminContentManager;
