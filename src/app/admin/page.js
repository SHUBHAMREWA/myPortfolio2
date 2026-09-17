"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  UploadCloud,
  LogOut,
  FolderGit2,
  Database,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Eye,
  Layers,
  Sparkles
} from "lucide-react";
import { TbCircleLetterS } from "react-icons/tb";

export default function AdminDashboard() {
  const router = useRouter();
  const { playClickSound, playHoverSound, playSuccessSound } = useAudio();

  // Authentication state
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    year: new Date().getFullYear().toString(),
    desc: "",
    overview: "",
    detailsLink: "#",
    stack: "",
    images: [],
    featured: true,
    order: 0,
  });

  const fileInputRef = useRef(null);

  // 1. Verify Authentication
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        setAdminUser(data.user);
        fetchProjects();
      } catch (err) {
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  // 2. Fetch Projects from MongoDB
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      setActionError("Failed to load projects from database.");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    playClickSound();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  // Seed Default Projects into MongoDB
  const handleSeedDatabase = async (force = false) => {
    playClickSound();
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/projects/seed${force ? "?force=true" : ""}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed database");
      setActionSuccess(data.message || "Database successfully seeded!");
      playSuccessSound();
      fetchProjects();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Handle Image Upload via Cloudinary API Route
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setActionError("");
    playClickSound();

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      const newUrls = (data.files || []).map((f) => f.url);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));

      playSuccessSound();
      setActionSuccess(`Uploaded ${newUrls.length} image(s) to Cloudinary!`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove an image from the draft project
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    playClickSound();
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      id: "",
      title: "",
      category: "",
      year: new Date().getFullYear().toString(),
      desc: "",
      overview: "",
      detailsLink: "#",
      stack: "",
      images: [],
      featured: true,
      order: projects.length,
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (proj) => {
    playClickSound();
    setIsEditing(true);
    setEditingId(proj.id);
    setFormData({
      id: proj.id,
      title: proj.title || "",
      category: proj.category || "",
      year: proj.year || new Date().getFullYear().toString(),
      desc: proj.desc || "",
      overview: proj.overview || "",
      detailsLink: proj.detailsLink || "#",
      stack: Array.isArray(proj.stack) ? proj.stack.join(", ") : (proj.stack || ""),
      images: proj.images || [],
      featured: proj.featured !== undefined ? proj.featured : true,
      order: proj.order || 0,
    });
    setModalOpen(true);
  };

  // Submit Project Form (Create or Update)
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!formData.title || !formData.category || !formData.desc) {
      setActionError("Please complete title, category, and description.");
      return;
    }

    if (formData.images.length === 0) {
      setActionError("Please upload at least one image to Cloudinary.");
      return;
    }

    setSubmitting(true);
    playClickSound();

    try {
      const payload = {
        ...formData,
        stack: formData.stack.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const url = isEditing ? `/api/projects/${editingId}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      playSuccessSound();
      setActionSuccess(isEditing ? "Project updated successfully!" : "Project created successfully!");
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    playClickSound();
    setActionError("");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project");

      playSuccessSound();
      setActionSuccess("Project deleted successfully");
      setDeleteConfirmId(null);
      fetchProjects();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c19c5c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Top Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-black/10 dark:border-white/10 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full border border-[#c19c5c]/40 bg-[#c19c5c]/10 flex items-center justify-center text-[#c19c5c]">
              <TbCircleLetterS className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#c19c5c]">
              ADMIN DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white">
            Works &amp; Project Management
          </h1>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Logged in as <span className="font-mono text-black dark:text-white">{adminUser?.email}</span>
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSeedDatabase(false)}
            onMouseEnter={playHoverSound}
            className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-mono font-bold tracking-wider text-black dark:text-white flex items-center gap-2 transition-all"
            title="Import existing default works if database is empty"
          >
            <Database className="w-3.5 h-3.5 text-[#c19c5c]" />
            Seed Works
          </button>

          <button
            onClick={handleOpenCreate}
            onMouseEnter={playHoverSound}
            className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Add New Work
          </button>

          <button
            onClick={handleLogout}
            onMouseEnter={playHoverSound}
            className="p-2.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {actionError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl p-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/40 dark:text-white/40 block mb-2">
            TOTAL WORKS IN DB
          </span>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-black dark:text-white">
            {projects.length}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl p-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/40 dark:text-white/40 block mb-2">
            MEDIA STORAGE
          </span>
          <div className="text-xl sm:text-2xl font-bold text-[#c19c5c] flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Cloudinary
          </div>
        </div>

        <div className="bg-white/60 dark:bg-[#111113]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl p-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/40 dark:text-white/40 block mb-2">
            DATABASE
          </span>
          <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
            <Database className="w-5 h-5" /> MongoDB
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="bg-white/70 dark:bg-[#111113]/70 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 dark:border-white/5">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#c19c5c]" /> Projects Collection
          </h2>
          <button
            onClick={fetchProjects}
            className="text-xs font-mono text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {loadingProjects ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#c19c5c] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-mono text-black/40 dark:text-white/40">Loading works from MongoDB...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 mb-4">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">No Works in Database Yet</h3>
            <p className="text-xs text-black/50 dark:text-white/50 max-w-sm mb-6">
              You haven't added any work history to MongoDB yet. You can create a new project or seed your 5 existing portfolio projects.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleSeedDatabase(false)}
                className="px-5 py-3 rounded-xl bg-[#c19c5c] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Seed Default 5 Projects
              </button>
              <button
                onClick={handleOpenCreate}
                className="px-5 py-3 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-black/5 transition-colors"
              >
                Add Custom Work
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="group relative bg-white dark:bg-[#161619] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#c19c5c]/50 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={proj.images?.[0] || "/placeholder.png"}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                    {proj.year || "2026"}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#c19c5c] text-black text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {proj.images?.length || 1} {proj.images?.length === 1 ? 'img' : 'imgs'}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#c19c5c] uppercase block mb-1">
                      {proj.category}
                    </span>
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase leading-snug mb-2 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-black/60 dark:text-white/60 line-clamp-2 leading-relaxed mb-4">
                      {proj.desc}
                    </p>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(proj.stack || []).slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {(proj.stack || []).length > 3 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 text-black/40 dark:text-white/40">
                          +{proj.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <a
                      href={`/work/${proj.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono tracking-wider text-black/60 dark:text-white/60 hover:text-[#c19c5c] flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === proj.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold uppercase"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-black/50 dark:text-white/50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-3xl p-6 sm:p-10 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#c19c5c]">
                  {isEditing ? "EDIT RECORD" : "NEW RECORD"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-black dark:text-white">
                  {isEditing ? `Edit: ${formData.title}` : "Add New Work to Portfolio"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-black/50 dark:text-white/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProject} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title: val,
                        // Auto-populate slug if creating
                        id: !isEditing && !prev.id ? val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : prev.id,
                      }));
                    }}
                    placeholder="e.g. AI Financial Dashboard"
                    required
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                  />
                </div>

                {/* Slug / ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                    Slug / Unique ID *
                  </label>
                  <input
                    type="text"
                    disabled={isEditing}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g. ai-financial-dashboard"
                    required
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Full-Stack Web App"
                    required
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                  />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                  />
                </div>

                {/* Details / Live Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                    Live / GitHub Link
                  </label>
                  <input
                    type="text"
                    value={formData.detailsLink}
                    onChange={(e) => setFormData({ ...formData, detailsLink: e.target.value })}
                    placeholder="https://..."
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.stack}
                  onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                  placeholder="React, Next.js, Node.js, MongoDB, Tailwind CSS"
                  className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                />
              </div>

              {/* Short Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                  Short Description (Card Summary) *
                </label>
                <textarea
                  rows={2}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="A concise summary shown on project cards and home page..."
                  required
                  className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                />
              </div>

              {/* Detailed Overview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                  Detailed Project Overview (Full Page)
                </label>
                <textarea
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Comprehensive description of the architecture, goals, challenges, and implementation..."
                  className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 text-black dark:text-white text-sm focus:border-[#c19c5c] focus:outline-none"
                />
              </div>

              {/* Cloudinary Image Upload Section */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-dashed border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-[#c19c5c]" /> Cloudinary Photo Upload
                    </h4>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Upload screenshots or mockups directly into Cloudinary media storage.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Upload File(s)
                      </>
                    )}
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Uploaded Images List / Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-black/10 dark:border-white/10 bg-black">
                        <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[8px] font-mono px-2 py-0.5 rounded">
                          {idx === 0 ? "Cover" : `#${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-black/70 dark:text-white/70 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-[#c19c5c] text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Project")}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
