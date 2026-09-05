import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

const SidebarAd = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("sidebar_ads")
        .select("*")
        .eq("is_active", true)
        .or(`is_expiring.eq.false,expires_at.is.null,expires_at.gt.${now}`)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) setAd(data);
    };
    fetchAd();
  }, []);

  if (!ad) return null;
  const content = <img src={ad.image_url} alt={ad.alt_text || ad.title} />;

  return (
    <aside className="sidebar-ad" aria-label="Advertisement">
      <span className="ad-label">ADVERTISEMENT</span>
      {ad.link_url ? (
        <a href={ad.link_url} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
      <style jsx>{`
        .sidebar-ad {
          background: #fff;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .ad-label {
          display: block;
          color: #64748b;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-align: center;
          margin-bottom: 6px;
        }
        .sidebar-ad a {
          display: block;
        }
        .sidebar-ad img {
          display: block;
          width: 100%;
          max-height: 280px;
          object-fit: contain;
          border-radius: 7px;
        }
      `}</style>
    </aside>
  );
};

export default SidebarAd;
