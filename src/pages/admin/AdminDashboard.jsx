import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  fetchDesigns, createDesign, updateDesign, deleteDesign, uploadImage,
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchServices, createService, updateService, deleteService,
  fetchEnquiries, deleteEnquiry,
} from '../../api';
import {
  LayoutDashboard, Images, Tag, Wrench, MessageSquare,
  LogOut, Plus, Trash2, Edit3, Upload, X, Check,
  Search, RefreshCw, AlertCircle, BarChart3,
  Image as ImageIcon, Loader2, Phone, Calendar,
  Star, ChevronRight
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium"
      style={{
        background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
        color: type === 'success' ? '#4ade80' : '#f87171',
        backdropFilter: 'blur(16px)',
        animation: 'slideUp 0.25s ease-out',
      }}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-xs text-center"
        style={{ background: 'var(--card-bg)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(239,68,68,0.12)' }}>
          <Trash2 size={22} style={{ color: '#ef4444' }} />
        </div>
        <p className="font-semibold mb-1.5" style={{ color: 'var(--text-main)' }}>Delete செய்யவா?</p>
        <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-secondary flex-1 text-sm py-2">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl font-semibold text-sm"
            style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SINGLE IMAGE UPLOADER — uses Express API
// ─────────────────────────────────────────────────────────────
function SingleImageUploader({ value, onChange, label = 'Image', index }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File size max 5MB'); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert('Upload failed: ' + (err.message || err));
    }
    setUploading(false);
  };

  return (
    <div>
      <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--text3)' }}>
        {label}
        {index === 0 && (
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(201,136,16,0.15)', color: 'var(--gold-main)' }}>Main</span>
        )}
      </p>
      {value ? (
        <div className="relative rounded-xl overflow-hidden group"
          style={{ border: '1px solid var(--border)', aspectRatio: '4/3', background: '#111' }}>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <Loader2 size={22} className="animate-spin text-white" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            <button type="button" onClick={() => inputRef.current?.click()}
              className="p-2 rounded-lg" style={{ background: 'rgba(201,136,16,0.9)', color: '#0a0705' }}>
              <Upload size={13} />
            </button>
            <button type="button" onClick={() => onChange('')}
              className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}>
              <X size={13} />
            </button>
          </div>
          <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full"
            style={{ background: '#4ade80', boxShadow: '0 0 5px #4ade80' }} />
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:border-[var(--gold-main)]"
          style={{ borderColor: 'var(--border)', aspectRatio: '4/3', color: 'var(--text4)', background: 'transparent' }}>
          {uploading
            ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--gold-main)' }} />
            : <><Upload size={18} style={{ color: 'var(--gold-main)' }} /><span className="text-xs">Upload</span></>
          }
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-center rounded-2xl w-12 h-12 shrink-0"
        style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold font-display leading-none" style={{ color: 'var(--text-main)' }}>{value}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text4)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5 font-medium" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FORM WRAPPER MODAL
// ─────────────────────────────────────────────────────────────
function FormCard({ title, onClose, onSave, saving, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-[9997]"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'100%',maxWidth:'680px',maxHeight:'90vh',display:'flex',flexDirection:'column',borderRadius:'1rem',background:'var(--card-bg)',border:'1px solid var(--border)',boxShadow:'0 30px 80px rgba(0,0,0,0.5)',overflow:'hidden' }}>
        <div className="w-full" style={{ display:'flex',flexDirection:'column',maxHeight:'90vh' }}>
          <div style={{ flexShrink:0 }}>
            <div style={{ height:3,background:'linear-gradient(90deg,#c98810,#f3d98a,#c98810)' }} />
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:'1px solid var(--border)' }}>
              <h3 className="font-display font-bold" style={{ color:'var(--text-main)' }}>{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color:'var(--text4)' }}><X size={18} /></button>
            </div>
          </div>
          <div className="p-6" style={{ overflowY:'auto',flex:1 }}>{children}</div>
          <div className="px-6 py-4 flex gap-3 justify-end" style={{ borderTop:'1px solid var(--border)',flexShrink:0 }}>
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={onSave} disabled={saving}
              className="btn btn-primary flex items-center gap-2 min-w-[120px] justify-center"
              style={{ opacity: saving ? 0.75 : 1 }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text4)' }}>{label}</label>
      {children}
    </div>
  );
}
const inp = { padding: '0.7rem 0.9rem', fontSize: '0.875rem' };

// ═════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadAll();
  }, [isAdmin]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [d, c, s, e] = await Promise.all([
        fetchDesigns(),
        fetchCategories(),
        fetchServices(),
        fetchEnquiries(),
      ]);
      setDesigns(d || []);
      setCategories(c || []);
      setServices(s || []);
      setEnquiries(e || []);
    } catch (err) {
      showToast('Failed to load data: ' + err.message, 'error');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
    { id: 'designs',    label: 'Designs',    icon: Images           },
    { id: 'categories', label: 'Categories', icon: Tag              },
    { id: 'services',   label: 'Services',   icon: Wrench           },
    { id: 'enquiries',  label: 'Enquiries',  icon: MessageSquare    },
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--section-bg)', paddingTop: '80px' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && <ConfirmModal {...confirm} />}

      <div className="sticky top-[80px] z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Om Sakthi Logo" style={{ width:34,height:34,borderRadius:'50%',display:'block',flexShrink:0 }} />
          <div className="leading-none">
            <div className="font-display font-semibold text-sm" style={{ color: 'var(--gold-main)' }}>Om Sakthi</div>
            <div className="text-[10px] tracking-widest uppercase opacity-70" style={{ color: 'var(--text-main)' }}>Admin Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAll} title="Refresh" className="p-2 rounded-lg" style={{ color: 'var(--text4)' }}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto px-4 py-6" style={{ maxWidth: '1280px' }}>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg,#c98810,#f3d98a)' : 'var(--card-bg)',
                color: activeTab === tab.id ? '#0a0705' : 'var(--text3)',
                border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(201,136,16,0.25)' : 'none',
              }}>
              <tab.icon size={15} />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview'   && <OverviewTab   designs={designs} categories={categories} services={services} enquiries={enquiries} />}
        {activeTab === 'designs'    && <DesignsTab    designs={designs} categories={categories} onRefresh={loadAll} showToast={showToast} setConfirm={setConfirm} />}
        {activeTab === 'categories' && <CategoriesTab categories={categories} onRefresh={loadAll} showToast={showToast} setConfirm={setConfirm} />}
        {activeTab === 'services'   && <ServicesTab   services={services} onRefresh={loadAll} showToast={showToast} setConfirm={setConfirm} />}
        {activeTab === 'enquiries'  && <EnquiriesTab  enquiries={enquiries} onRefresh={loadAll} showToast={showToast} setConfirm={setConfirm} />}
      </div>

      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── Overview ──────────────────────────────────────────────────
function OverviewTab({ designs, categories, services, enquiries }) {
  const today = enquiries.filter(e => new Date(e.createdAt || e.created_at).toDateString() === new Date().toDateString()).length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Images}        label="Total Designs"   value={designs.length}    color="#c98810" />
        <StatCard icon={Tag}           label="Categories"      value={categories.length} color="#8b5cf6" />
        <StatCard icon={Wrench}        label="Services"        value={services.length}   color="#3b82f6" />
        <StatCard icon={MessageSquare} label="Total Enquiries" value={enquiries.length}  color="#22c55e" sub={today ? `+${today} today` : null} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold" style={{ color: 'var(--text-main)' }}>Recent Enquiries</h3>
        </div>
        {enquiries.slice(0, 5).map((enq, i) => (
          <div key={enq.id || enq._id} className="px-5 py-3.5 flex items-center gap-3"
            style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: 'rgba(201,136,16,0.12)', color: 'var(--gold-main)' }}>
              {enq.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{enq.name}</p>
              <p className="text-xs" style={{ color: 'var(--text4)' }}>{enq.phone}{enq.design_id ? ` · ${enq.design_id}` : ''}</p>
            </div>
            <p className="text-xs shrink-0" style={{ color: 'var(--text4)' }}>
              {new Date(enq.createdAt || enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        ))}
        {enquiries.length === 0 && <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text4)' }}>No enquiries yet</p>}
      </div>
    </div>
  );
}

// ─── Designs Tab ────────────────────────────────────────────────
function DesignsTab({ designs, categories, onRefresh, showToast, setConfirm }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const filtered = designs.filter(d => {
    const matchCat = filterCat === 'all' || d.category === filterCat;
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.id?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id, title) => {
    setConfirm({
      msg: `"${title}" design-ஐ நிரந்தரமாக delete செய்யவா?`,
      onConfirm: async () => {
        try { await deleteDesign(id); showToast('Design deleted!'); onRefresh(); } catch (e) { showToast(e.message, 'error'); }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-main)' }}>Designs</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,136,16,0.12)', color: 'var(--gold-main)' }}>{designs.length}</span>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg,#c98810,#f3d98a)', color: '#0a0705' }}>
          <Plus size={16} /> Add Design
        </button>
      </div>
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text4)', pointerEvents: 'none' }} />
          <input className="form-input w-full" placeholder="Search designs…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.6rem 1rem 0.6rem 2.3rem', fontSize: '0.875rem' }} />
        </div>
        <select className="form-input" style={{ padding: '0.6rem 0.9rem', fontSize: '0.875rem', minWidth: 150 }}
          value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {showForm && (
        <DesignForm item={editItem} categories={categories}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); onRefresh(); showToast(editItem ? 'Design updated! ✓' : 'Design added! ✓'); }} />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(design => (
          <div key={design.id} className="rounded-2xl overflow-hidden group" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: '#111' }}>
              {design.image
                ? <img src={design.image} alt={design.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={26} style={{ color: 'var(--text4)' }} /></div>}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <button onClick={() => { setEditItem(design); setShowForm(true); }} className="p-2.5 rounded-xl" style={{ background: 'rgba(201,136,16,0.9)', color: '#0a0705' }}><Edit3 size={15} /></button>
                <button onClick={() => handleDelete(design.id, design.title)} className="p-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-main)' }}>{design.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {design.category && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{design.category}</span>}
                {design.tag && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,136,16,0.12)', color: 'var(--gold-main)' }}>{design.tag}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <ImageIcon size={40} className="mx-auto mb-3" style={{ color: 'var(--text4)', opacity: 0.3 }} />
          <p className="text-sm" style={{ color: 'var(--text4)' }}>No designs found</p>
        </div>
      )}
    </div>
  );
}

// ─── Design Form ────────────────────────────────────────────────
function DesignForm({ item, categories, onClose, onSaved }) {
  const isEdit = !!item;
  const existingImages = item?.images?.filter(Boolean) || [];
  const [form, setForm] = useState({
    id: item?.id || '', title: item?.title || '', category: item?.category || '',
    tag: item?.tag || '', image: item?.image || '',
    img2: existingImages[1] || '', img3: existingImages[2] || '',
    description: item?.description || '', finish: item?.details?.finish || '',
    size: item?.details?.size || '', min_qty: item?.details?.minQty || '',
    delivery: item?.details?.delivery || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title required'); return; }
    if (!isEdit && !form.id.trim()) { alert('Design ID required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (!isEdit) fd.append('id', form.id.trim().toUpperCase());
      fd.append('title', form.title.trim());
      if (form.category) fd.append('category', form.category);
      if (form.tag) fd.append('tag', form.tag);
      if (form.description) fd.append('description', form.description);
      if (form.finish) fd.append('finish', form.finish);
      if (form.size) fd.append('size', form.size);
      if (form.min_qty) fd.append('min_qty', form.min_qty);
      if (form.delivery) fd.append('delivery', form.delivery);
      // Pass image URLs as URL fields (already uploaded via SingleImageUploader)
      if (form.image) fd.append('imageUrl', form.image);
      if (form.img2) fd.append('img2Url', form.img2);
      if (form.img3) fd.append('img3Url', form.img3);

      if (isEdit) { await updateDesign(item.id, fd); }
      else { await createDesign(fd); }
      onSaved();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <FormCard title={isEdit ? `Edit: ${item.title}` : 'Add New Design'} onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="mb-6 p-4 rounded-2xl" style={{ background: 'var(--section-bg)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <ImageIcon size={15} style={{ color: 'var(--gold-main)' }} /> Design Images
          <span className="text-xs font-normal" style={{ color: 'var(--text4)' }}>(max 3 images)</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          <SingleImageUploader label="Image 1" index={0} value={form.image} onChange={v => set('image', v)} />
          <SingleImageUploader label="Image 2" index={1} value={form.img2}  onChange={v => set('img2',  v)} />
          <SingleImageUploader label="Image 3" index={2} value={form.img3}  onChange={v => set('img3',  v)} />
        </div>
        <p className="text-xs mt-2.5" style={{ color: 'var(--text4)' }}>💡 Image 1 = main thumbnail. Images 2 & 3 appear in gallery slideshow.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isEdit && (
          <Field label="Design ID *">
            <input className="form-input w-full" style={inp} placeholder="e.g. WC-001 (unique)"
              value={form.id} onChange={e => set('id', e.target.value.toUpperCase())} />
          </Field>
        )}
        <Field label="Title *" className={isEdit ? 'sm:col-span-1' : ''}>
          <input className="form-input w-full" style={inp} placeholder="e.g. Gold Wedding Card"
            value={form.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <Field label="Category">
          <select className="form-input w-full" style={inp} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">— Select —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Tag"><input className="form-input w-full" style={inp} placeholder="New / Trending / Popular" value={form.tag} onChange={e => set('tag', e.target.value)} /></Field>
        <Field label="Finish"><input className="form-input w-full" style={inp} placeholder="Glossy / Matte / Soft Touch" value={form.finish} onChange={e => set('finish', e.target.value)} /></Field>
        <Field label="Size"><input className="form-input w-full" style={inp} placeholder="A4 / 5×7 inches" value={form.size} onChange={e => set('size', e.target.value)} /></Field>
        <Field label="Min Quantity"><input className="form-input w-full" style={inp} placeholder="50 pcs" value={form.min_qty} onChange={e => set('min_qty', e.target.value)} /></Field>
        <Field label="Delivery Time"><input className="form-input w-full" style={inp} placeholder="3–5 business days" value={form.delivery} onChange={e => set('delivery', e.target.value)} /></Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea className="form-input w-full" style={{ ...inp, resize: 'none', minHeight: '80px' }} placeholder="Short description…" value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>
      </div>
    </FormCard>
  );
}

// ─── Categories Tab ─────────────────────────────────────────────
function CategoriesTab({ categories, onRefresh, showToast, setConfirm }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ id: '', label: '' });
  const [saving, setSaving] = useState(false);

  const openAdd  = () => { setForm({ id: '', label: '' }); setEditItem(null); setShowForm(true); };
  const openEdit = c  => { setForm({ id: c.id, label: c.label }); setEditItem(c); setShowForm(true); };

  const handleSave = async () => {
    if (!form.id.trim() || !form.label.trim()) { alert('Both fields required'); return; }
    setSaving(true);
    try {
      if (editItem) { await updateCategory(editItem.id, form.label.trim()); }
      else { await createCategory({ id: form.id.trim(), label: form.label.trim() }); }
      setShowForm(false); onRefresh(); showToast(editItem ? 'Category updated! ✓' : 'Category added! ✓');
    } catch (e) { alert('Error: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = (id) => {
    setConfirm({
      msg: `"${id}" delete செய்தால் related designs affected ஆகும்!`,
      onConfirm: async () => {
        try { await deleteCategory(id); showToast('Deleted!'); onRefresh(); } catch (e) { showToast(e.message, 'error'); }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-main)' }}>Categories</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{categories.length}</span>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#c98810,#f3d98a)', color: '#0a0705' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>
      {showForm && (
        <FormCard title={editItem ? 'Edit Category' : 'New Category'} onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="ID (slug) *">
              <input className="form-input w-full" style={{ ...inp, opacity: editItem ? 0.5 : 1 }}
                placeholder="wedding-cards" value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editItem} />
              {!editItem && <p className="text-xs mt-1" style={{ color: 'var(--text4)' }}>Auto-lowercase & hyphenated</p>}
            </Field>
            <Field label="Display Label *">
              <input className="form-input w-full" style={inp} placeholder="Wedding Cards"
                value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            </Field>
          </div>
        </FormCard>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{cat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text4)' }}>id: {cat.id}</p>
            </div>
            <div className="flex gap-2 ml-3 shrink-0">
              <button onClick={() => openEdit(cat)} className="p-2 rounded-xl" style={{ background: 'rgba(201,136,16,0.1)', color: 'var(--gold-main)' }}><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="col-span-3 py-10 text-center text-sm" style={{ color: 'var(--text4)' }}>No categories yet</p>}
      </div>
    </div>
  );
}

// ─── Services Tab ───────────────────────────────────────────────
function ServicesTab({ services, onRefresh, showToast, setConfirm }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ icon: '', title: '', description: '', highlight: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setForm({ icon: '', title: '', description: '', highlight: '' }); setEditItem(null); setShowForm(true); };
  const openEdit = s  => { setForm({ icon: s.icon||'', title: s.title||'', description: s.description||'', highlight: s.highlight||'' }); setEditItem(s); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title required'); return; }
    setSaving(true);
    try {
      const payload = { icon: form.icon||null, title: form.title.trim(), description: form.description||null, highlight: form.highlight||null };
      if (editItem) { await updateService(editItem._id || editItem.id, payload); }
      else { await createService(payload); }
      setShowForm(false); onRefresh(); showToast(editItem ? 'Service updated! ✓' : 'Service added! ✓');
    } catch (e) { alert('Error: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = (id, title) => {
    setConfirm({
      msg: `"${title}" service-ஐ delete செய்யவா?`,
      onConfirm: async () => {
        try { await deleteService(id); showToast('Deleted!'); onRefresh(); } catch (e) { showToast(e.message, 'error'); }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-main)' }}>Services</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>{services.length}</span>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#c98810,#f3d98a)', color: '#0a0705' }}>
          <Plus size={16} /> Add Service
        </button>
      </div>
      {showForm && (
        <FormCard title={editItem ? 'Edit Service' : 'New Service'} onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *"><input className="form-input w-full" style={inp} placeholder="e.g. Wedding Cards" value={form.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Icon (emoji)"><input className="form-input w-full" style={{ ...inp, fontSize: '1.4rem', letterSpacing: 2 }} placeholder="💍" value={form.icon} onChange={e => set('icon', e.target.value)} /></Field>
            <Field label="Highlight / Badge">
              <input className="form-input w-full" style={inp} placeholder="Most Popular / Fast / New" value={form.highlight} onChange={e => set('highlight', e.target.value)} />
              <p className="text-xs mt-1" style={{ color: 'var(--text4)' }}>Shown as a gold badge on the card</p>
            </Field>
            <div />
            <Field label="Description" className="sm:col-span-2">
              <textarea className="form-input w-full" style={{ ...inp, resize: 'none', minHeight: '90px' }} placeholder="Describe this service…" value={form.description} onChange={e => set('description', e.target.value)} />
            </Field>
          </div>
        </FormCard>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(svc => (
          <div key={svc._id || svc.id} className="relative p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            {svc.highlight && (
              <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'linear-gradient(135deg,#c98810,#f3d98a)', color: '#0a0705' }}>{svc.highlight}</span>
            )}
            <div className="text-3xl mb-3">{svc.icon || '🖨️'}</div>
            <p className="font-bold mb-1" style={{ color: 'var(--text-main)' }}>{svc.title}</p>
            {svc.description && <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text4)' }}>{svc.description}</p>}
            <div className="flex gap-2">
              <button onClick={() => openEdit(svc)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(201,136,16,0.1)', color: 'var(--gold-main)' }}><Edit3 size={12} /> Edit</button>
              <button onClick={() => handleDelete(svc._id || svc.id, svc.title)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="col-span-3 py-10 text-center text-sm" style={{ color: 'var(--text4)' }}>No services yet</p>}
      </div>
    </div>
  );
}

// ─── Enquiries Tab ──────────────────────────────────────────────
function EnquiriesTab({ enquiries, onRefresh, showToast, setConfirm }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = enquiries.filter(e =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.phone?.includes(search) || e.design_id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setConfirm({
      msg: 'இந்த enquiry-ஐ delete செய்யவா?',
      onConfirm: async () => {
        try { await deleteEnquiry(id); showToast('Deleted!'); onRefresh(); } catch (e) { showToast(e.message, 'error'); }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-main)' }}>Enquiries</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>{enquiries.length}</span>
        </div>
      </div>
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text4)', pointerEvents: 'none' }} />
        <input className="form-input w-full" placeholder="Search by name, phone, design ID…" value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.65rem 1rem 0.65rem 2.3rem', fontSize: '0.875rem' }} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {filtered.map((enq, i) => (
          <div key={enq.id || enq._id} style={{ background: i%2===0?'var(--card-bg)':'var(--section-bg)', borderBottom: i<filtered.length-1?'1px solid var(--border)':'none' }}>
            <div className="px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: 'rgba(201,136,16,0.12)', color: 'var(--gold-main)' }}>
                {enq.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{enq.name}</span>
                  {enq.design_id && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{enq.design_id}</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text4)' }}><Phone size={10} />{enq.phone}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text4)' }}>
                    <Calendar size={10} />
                    {new Date(enq.createdAt || enq.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {enq.message && (
                  <button onClick={() => setExpanded(expanded===enq.id?null:enq.id)} className="p-2 rounded-lg" style={{ background: 'var(--glass)', color: 'var(--text3)' }}>
                    <ChevronRight size={14} style={{ transform: expanded===enq.id?'rotate(90deg)':'none', transition:'transform 0.2s' }} />
                  </button>
                )}
                <a href={`https://wa.me/${enq.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>💬</a>
                <button onClick={() => handleDelete(enq.id || enq._id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><Trash2 size={13} /></button>
              </div>
            </div>
            {expanded===enq.id && enq.message && (
              <div className="px-4 pb-3.5" style={{ paddingLeft: '4rem' }}>
                <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--glass)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{enq.message}</div>
              </div>
            )}
          </div>
        ))}
        {filtered.length===0 && (
          <div className="py-16 text-center" style={{ background: 'var(--card-bg)' }}>
            <MessageSquare size={36} className="mx-auto mb-3" style={{ color: 'var(--text4)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text4)' }}>No enquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
