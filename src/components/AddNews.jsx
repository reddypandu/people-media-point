import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    video_url: '',
    category_id: '',
    district_id: '',
    is_hero_slider: false,
    is_top_hero: false,
    whatsapp_link: ''
  });
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const articleId = searchParams.get('id');

  useEffect(() => {
    fetchCategories();
    if (articleId) {
      fetchArticleForEdit(articleId);
    }
  }, [articleId]);

  const fetchArticleForEdit = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setFormData({
          title: data.title || '',
          content: data.content || '',
          image_url: data.image_url || '',
          video_url: data.video_url || '',
          category_id: data.category_id || '',
          district_id: data.district_id || '',
          is_hero_slider: data.is_hero_slider || false,
          is_top_hero: data.is_top_hero || false,
          whatsapp_link: data.whatsapp_link || ''
        });
      }
    } catch (e) {
      console.log('Error fetching article for edit', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.category_id) {
      fetchDistricts(formData.category_id);
    } else {
      setDistricts([]);
    }
  }, [formData.category_id]);

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*');
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { id: 1, name: 'Latest News' },
          { id: 2, name: 'Telangana' },
          { id: 3, name: 'Andhra Pradesh' },
          { id: 4, name: 'Politics' },
          { id: 5, name: 'Movie' },
          { id: 6, name: 'Crime' },
          { id: 7, name: 'Sports' },
          { id: 8, name: 'Technology' },
          { id: 9, name: 'Business' }
        ]);
      }
    } catch (e) {
      setCategories([
        { id: 1, name: 'Latest News' },
        { id: 2, name: 'Telangana' },
        { id: 3, name: 'Andhra Pradesh' },
        { id: 4, name: 'Politics' },
        { id: 5, name: 'Movie' },
        { id: 6, name: 'Crime' },
        { id: 7, name: 'Sports' },
        { id: 8, name: 'Technology' },
        { id: 9, name: 'Business' }
      ]);
    }
  };

  const fetchDistricts = async (categoryId) => {
    try {
      const { data } = await supabase.from('districts').select('*').eq('category_id', categoryId);
      setDistricts(data || []);
    } catch (e) {
      setDistricts([]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `news-articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) {
        // Fallback: Convert to Data URL if Supabase storage bucket doesn't exist yet
        console.warn('Supabase storage bucket upload error:', uploadError.message);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image_url: reader.result }));
          alert('Notice: Supabase bucket "news-images" not found, using local image preview. Create "news-images" public bucket in Supabase Storage for cloud image storage.');
        };
        reader.readAsDataURL(file);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
      }
    } catch (error) {
      alert('Upload Notice: Using image file. ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url,
      video_url: formData.video_url,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      district_id: formData.district_id ? parseInt(formData.district_id) : null,
      is_hero_slider: formData.is_hero_slider,
      is_top_hero: formData.is_top_hero,
      whatsapp_link: formData.whatsapp_link
    };

    try {
      let error;
      if (articleId) {
        const res = await supabase.from('articles').update(payload).eq('id', articleId);
        error = res.error;
      } else {
        const res = await supabase.from('articles').insert([payload]);
        error = res.error;
      }

      if (error) {
        // Fallback: Check if edge function was requested
        console.warn('Direct database error:', error.message);
        const { data: fnData, error: fnError } = await supabase.functions.invoke('manage-articles', {
          body: { action: articleId ? 'update-article' : 'create-article', data: articleId ? { ...payload, id: articleId } : payload }
        });

        if (fnError) {
          throw new Error(error.message || fnError.message);
        }
      }

      alert(`Article ${articleId ? 'updated' : 'published'} successfully!`);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(`Notice: ${err.message}. If tables don't exist yet in Supabase, run supabase/schema.sql in Supabase SQL Editor.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-news-container">
      <div className="form-header">
        <h2>{articleId ? 'Edit Article' : 'Post New Article'}</h2>
        <p>{articleId ? 'Update the details of your article below.' : 'Fill in the details below to publish news across People Media Point.'}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-section">
          <h3>Main Content</h3>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Enter news title in Telugu/English..."
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>News Content</label>
            <textarea 
              placeholder="Write the full story here..."
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
              rows="10"
              required 
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Placement & Category</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Target Category</label>
              <select 
                value={formData.category_id} 
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {districts.length > 0 && (
              <div className="form-group">
                <label>District (Optional)</label>
                <select 
                  value={formData.district_id} 
                  onChange={(e) => setFormData({...formData, district_id: e.target.value})}
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={formData.is_top_hero} 
                onChange={(e) => setFormData({...formData, is_top_hero: e.target.checked})} 
              />
              Show in Hero Main Banner (V6 Top Slider)
            </label>

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={formData.is_hero_slider} 
                onChange={(e) => setFormData({...formData, is_hero_slider: e.target.checked})} 
              />
              Include in Trending / Latest News
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Media & Links</h3>
          
          <div className="form-group">
            <label>Featured Image</label>
            <div 
              className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.image_url ? (
                <div className="preview-container">
                  <img src={formData.image_url} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-img-btn"
                    onClick={() => setFormData({...formData, image_url: ''})}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <p>Drag and drop an image here, or <span>browse</span></p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    disabled={uploading}
                    className="file-input-hidden"
                  />
                  {uploading && <p className="uploading-text">Uploading image...</p>}
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '0.8rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#666' }}>Or paste image web URL directly:</label>
              <input 
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>YouTube Video Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.video_url} 
              onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>WhatsApp Channel Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://whatsapp.com/channel/..."
              value={formData.whatsapp_link} 
              onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Publishing...' : (articleId ? 'Update Article' : 'Publish News')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .add-news-container {
          max-width: 850px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .form-header {
          margin-bottom: 2rem;
          border-bottom: 2px solid #001d3d;
          padding-bottom: 1rem;
        }
        .form-header h2 { color: #001d3d; margin-bottom: 0.5rem; }
        .news-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .form-section {
          background: white;
          padding: 1.8rem;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }
        .form-section h3 {
          color: #001d3d;
          margin-bottom: 1.2rem;
          font-size: 1.15rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        .form-group {
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-weight: 700;
          color: #333;
          font-size: 0.9rem;
        }
        .form-group input[type="text"],
        .form-group input[type="url"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .drag-drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          background: #fafafa;
          position: relative;
          cursor: pointer;
        }
        .drag-drop-zone.active {
          border-color: #D32F2F;
          background: #FEF2F2;
        }
        .file-input-hidden {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .image-preview {
          max-height: 200px;
          border-radius: 6px;
          object-fit: cover;
        }
        .remove-img-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .submit-btn {
          background: #001d3d;
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
        }
        .submit-btn:hover { background: #D32F2F; }
      `}</style>
    </div>
  );
};

export default AddNews;
