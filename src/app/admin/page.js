"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  Sparkles,
  Lock,
  Star,
  Globe,
  Calendar,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
  Link2,
  SlidersHorizontal,
  Info,
  GripVertical,
  LayoutGrid,
  Kanban,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
} from "lucide-react";
import { TbCircleLetterS } from "react-icons/tb";

export default function AdminDashboard() {
  const router = useRouter();
  const { playClickSound, playHoverSound, playSuccessSound } = useAudio();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const [manualImageUrl, setManualImageUrl] = useState("");
  const fileInputRef = useRef(null);

  // Kanban view and Drag-and-drop reorder state
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "kanban"
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSaveMessage, setOrderSaveMessage] = useState("");

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

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

  // Lock body scroll and hide navbar when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("admin-modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("admin-modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("admin-modal-open");
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

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
    playClickSound();
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Promote an image to cover photo (index 0)
  const handleSetCoverImage = (index) => {
    if (index === 0) return;
    playSuccessSound();
    setFormData((prev) => {
      const copy = [...prev.images];
      const [selected] = copy.splice(index, 1);
      copy.unshift(selected);
      return { ...prev, images: copy };
    });
  };

  // Reorder image position (left/right or up/down)
  const handleMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.images.length) return;
    playClickSound();
    setFormData((prev) => {
      const copy = [...prev.images];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return { ...prev, images: copy };
    });
  };

  // Add image URL manually
  const handleAddManualImage = (e) => {
    if (e) e.preventDefault();
    if (!manualImageUrl.trim()) return;
    playSuccessSound();
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, manualImageUrl.trim()],
    }));
    setManualImageUrl("");
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
      order: projects.length + 1,
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
      order: proj.order || 1,
    });
    setModalOpen(true);
  };

  // Reorder & Drag-and-Drop Handlers
  const saveNewProjectOrder = async (reorderedProjects) => {
    setIsSavingOrder(true);
    setActionError("");
    try {
      const orderedIds = reorderedProjects.map((p) => p.id);
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update project order");

      playSuccessSound();
      const topProject = reorderedProjects[0];
      setOrderSaveMessage(`"${topProject.title}" is now #1 at the top of your showcase`);
      setTimeout(() => setOrderSaveMessage(""), 5000);

      if (data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      setActionError(err.message);
      fetchProjects();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const updated = [...projects];
    const [movedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    const reindexed = updated.map((p, i) => ({ ...p, order: i + 1 }));
    setProjects(reindexed);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);

    await saveNewProjectOrder(reindexed);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleMoveProject = async (currentIndex, direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;

    playClickSound();
    const updated = [...projects];
    const [item] = updated.splice(currentIndex, 1);
    updated.splice(newIndex, 0, item);

    const reindexed = updated.map((p, i) => ({ ...p, order: i + 1 }));
    setProjects(reindexed);

    await saveNewProjectOrder(reindexed);
  };

  const handleMoveToTop = async (currentIndex) => {
    if (currentIndex === 0) return;
    playClickSound();
    const updated = [...projects];
    const [item] = updated.splice(currentIndex, 1);
    updated.unshift(item);

    const reindexed = updated.map((p, i) => ({ ...p, order: i + 1 }));
    setProjects(reindexed);

    await saveNewProjectOrder(reindexed);
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
        
        {/* Section Header with View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/5 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#c19c5c]" /> Projects Collection
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c19c5c]/10 text-[#c19c5c] font-bold border border-[#c19c5c]/20">
                1-Based Indexing
              </span>
            </div>
            <p className="text-xs text-black/50 dark:text-white/50">
              Drag and drop works or use quick-rank buttons. Project with <span className="text-[#c19c5c] font-bold font-mono">Index #1</span> is displayed first at the very top of your live portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Saving indicator */}
            {isSavingOrder && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#c19c5c] animate-pulse mr-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving order...</span>
              </div>
            )}

            {/* View Mode Toggle: Grid Cards vs. Kanban Board */}
            <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setViewMode("grid"); playClickSound(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-white dark:bg-[#1f1f23] text-[#c19c5c] shadow-sm" 
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                type="button"
                onClick={() => { setViewMode("kanban"); playClickSound(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "kanban" 
                    ? "bg-white dark:bg-[#1f1f23] text-[#c19c5c] shadow-sm" 
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                }`}
                title="Kanban Drag-and-Drop Reorder Board"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
            </div>

            <button
              onClick={fetchProjects}
              className="text-xs font-mono text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 border border-black/5 dark:border-white/5"
              title="Refresh works from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Order Saved Toast Banner */}
        {orderSaveMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#c19c5c]/10 border border-[#c19c5c]/30 text-[#c19c5c] text-xs font-mono flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#c19c5c]" />
              <span className="font-semibold">{orderSaveMessage}</span>
            </div>
            <button onClick={() => setOrderSaveMessage("")} className="hover:opacity-70 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
        ) : viewMode === "grid" ? (
          
          /* ── GRID VIEW (WITH DRAG-AND-DROP REORDERING) ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => {
              const isFirst = idx === 0 || proj.order === 1;
              const isDragging = draggedItemIndex === idx;
              const isDragOver = dragOverItemIndex === idx;

              return (
                <div
                  key={proj.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`group relative bg-white dark:bg-[#161619] border rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-300 ${
                    isDragging 
                      ? "opacity-30 scale-95 border-dashed border-[#c19c5c]" 
                      : isDragOver
                      ? "border-[#c19c5c] ring-2 ring-[#c19c5c] ring-offset-2 scale-[1.02] shadow-xl"
                      : "border-black/10 dark:border-white/10 hover:border-[#c19c5c]/50"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 cursor-grab active:cursor-grabbing">
                    <img
                      src={proj.images?.[0] || "/placeholder.png"}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />

                    {/* Top-Left: Index Badge & Year */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <div className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md ${
                        isFirst 
                          ? "bg-[#c19c5c] text-black font-extrabold shadow-[#c19c5c]/30" 
                          : "bg-black/80 backdrop-blur-md text-white/90 border border-white/20"
                      }`}>
                        <span>#{idx + 1}</span>
                        {isFirst && (
                          <span className="text-[8px] bg-black text-[#c19c5c] px-1 py-0.5 rounded font-black tracking-tight">
                            TOP
                          </span>
                        )}
                      </div>

                      <div className="bg-black/70 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                        {proj.year || "2026"}
                      </div>
                    </div>

                    {/* Top-Right: Image Count */}
                    <div className="absolute top-3 right-3 bg-[#c19c5c] text-black text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {proj.images?.length || 1} {proj.images?.length === 1 ? 'img' : 'imgs'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono tracking-widest text-[#c19c5c] uppercase block">
                          {proj.category}
                        </span>
                        <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                          Index: #{idx + 1}
                        </span>
                      </div>

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

                    {/* Card Actions & Reorder Controls */}
                    <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Drag Handle */}
                        <div 
                          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag card to reorder position"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Quick Reorder Buttons */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveToTop(idx)}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                            title="Promote to Top (#1)"
                          >
                            <ArrowUpToLine className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveProject(idx, -1)}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 transition-colors"
                            title="Move earlier (Rank up)"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {idx < projects.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveProject(idx, 1)}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 transition-colors"
                            title="Move later (Rank down)"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <a
                          href={`/work/${proj.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono tracking-wider text-black/60 dark:text-white/60 hover:text-[#c19c5c] flex items-center gap-1 transition-colors ml-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
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
              );
            })}
          </div>
        ) : (
          
          /* ── KANBAN REORDER BOARD (DRAG-AND-DROP LANES) ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lane 1: Top Priority Showcase (#1 - #3) */}
            <div 
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                if (draggedItemIndex !== null && draggedItemIndex > 2) {
                  handleDrop(e, 0); // Drop to slot #1
                }
              }}
              className="flex flex-col bg-black/[0.02] dark:bg-white/[0.02] border border-[#c19c5c]/30 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c19c5c]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c19c5c] animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Top Showcase (#1 - #3)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c19c5c] text-black font-extrabold">
                  {projects.slice(0, 3).length} / 3
                </span>
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 mb-4">
                These works appear first in your homepage hero showcase and portfolio top.
              </p>

              <div className="flex flex-col gap-3 min-h-[140px]">
                {projects.slice(0, 3).map((proj, i) => {
                  const globalIdx = i;
                  const isFirst = globalIdx === 0;
                  const isDragging = draggedItemIndex === globalIdx;
                  const isDragOver = dragOverItemIndex === globalIdx;

                  return (
                    <div
                      key={proj.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, globalIdx)}
                      onDragOver={(e) => handleDragOver(e, globalIdx)}
                      onDrop={(e) => handleDrop(e, globalIdx)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-xl border bg-white dark:bg-[#161619] flex flex-col gap-2.5 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? "opacity-30 scale-95 border-dashed border-[#c19c5c]"
                          : isDragOver
                          ? "border-[#c19c5c] ring-2 ring-[#c19c5c] scale-[1.02] shadow-md"
                          : isFirst
                          ? "border-[#c19c5c]/60 shadow-[#c19c5c]/5"
                          : "border-black/10 dark:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0" />
                        
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
                          <img src={proj.images?.[0] || "/placeholder.png"} alt={proj.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                              isFirst ? "bg-[#c19c5c] text-black font-extrabold" : "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                            }`}>
                              #{globalIdx + 1} {isFirst && "★ TOP"}
                            </span>
                            <span className="text-[10px] font-mono text-[#c19c5c] uppercase truncate">
                              {proj.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-black dark:text-white truncate">
                            {proj.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-1">
                          {globalIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveToTop(globalIdx)}
                              className="px-2 py-0.5 rounded bg-[#c19c5c]/15 text-[#c19c5c] text-[9px] font-mono font-bold hover:bg-[#c19c5c]/25 transition-colors cursor-pointer"
                              title="Make #1 Top"
                            >
                              Make #1
                            </button>
                          )}
                          {globalIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIdx, -1)}
                              className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                          )}
                          {globalIdx < projects.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIdx, 1)}
                              className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(proj)}
                            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(proj.id)}
                            className="p-1.5 rounded text-red-500/80 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lane 2: Selected Works (#4 - #6) */}
            <div 
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                if (draggedItemIndex !== null && (draggedItemIndex < 3 || draggedItemIndex > 5)) {
                  handleDrop(e, 3); // Drop to slot #4
                }
              }}
              className="flex flex-col bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Selected Works (#4 - #6)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-black/70 dark:text-white/70 font-bold">
                  {projects.slice(3, 6).length} / 3
                </span>
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 mb-4">
                Core portfolio works displayed right after your hero spotlight.
              </p>

              <div className="flex flex-col gap-3 min-h-[140px]">
                {projects.slice(3, 6).length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-black/10 dark:border-white/10 text-center text-[11px] font-mono text-black/40 dark:text-white/40 my-auto">
                    Drag projects here to rank them as Selected Works (#4 - #6)
                  </div>
                ) : (
                  projects.slice(3, 6).map((proj, i) => {
                    const globalIdx = 3 + i;
                    const isDragging = draggedItemIndex === globalIdx;
                    const isDragOver = dragOverItemIndex === globalIdx;

                    return (
                      <div
                        key={proj.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, globalIdx)}
                        onDragOver={(e) => handleDragOver(e, globalIdx)}
                        onDrop={(e) => handleDrop(e, globalIdx)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-xl border bg-white dark:bg-[#161619] flex flex-col gap-2.5 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                          isDragging
                            ? "opacity-30 scale-95 border-dashed border-[#c19c5c]"
                            : isDragOver
                            ? "border-[#c19c5c] ring-2 ring-[#c19c5c] scale-[1.02] shadow-md"
                            : "border-black/10 dark:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0" />
                          
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
                            <img src={proj.images?.[0] || "/placeholder.png"} alt={proj.title} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase bg-black/10 dark:bg-white/10 text-black dark:text-white">
                                #{globalIdx + 1}
                              </span>
                              <span className="text-[10px] font-mono text-[#c19c5c] uppercase truncate">
                                {proj.category}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-black dark:text-white truncate">
                              {proj.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveToTop(globalIdx)}
                              className="px-2 py-0.5 rounded bg-[#c19c5c]/15 text-[#c19c5c] text-[9px] font-mono font-bold hover:bg-[#c19c5c]/25 transition-colors cursor-pointer"
                              title="Make #1 Top"
                            >
                              Make #1
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIdx, -1)}
                              className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            {globalIdx < projects.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveProject(globalIdx, 1)}
                                className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(proj)}
                              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(proj.id)}
                              className="p-1.5 rounded text-red-500/80 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Lane 3: Extended Portfolio (#7+) */}
            <div 
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                if (draggedItemIndex !== null && draggedItemIndex < 6) {
                  handleDrop(e, 6); // Drop to slot #7
                }
              }}
              className="flex flex-col bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                    Extended Portfolio (#7+)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-black/70 dark:text-white/70 font-bold">
                  {projects.slice(6).length}
                </span>
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 mb-4">
                Additional works and case studies in your full catalog.
              </p>

              <div className="flex flex-col gap-3 min-h-[140px]">
                {projects.slice(6).length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-black/10 dark:border-white/10 text-center text-[11px] font-mono text-black/40 dark:text-white/40 my-auto">
                    {projects.length <= 6 
                      ? "Add more projects to populate extended archive"
                      : "Drag projects here to rank them as #7+"}
                  </div>
                ) : (
                  projects.slice(6).map((proj, i) => {
                    const globalIdx = 6 + i;
                    const isDragging = draggedItemIndex === globalIdx;
                    const isDragOver = dragOverItemIndex === globalIdx;

                    return (
                      <div
                        key={proj.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, globalIdx)}
                        onDragOver={(e) => handleDragOver(e, globalIdx)}
                        onDrop={(e) => handleDrop(e, globalIdx)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-xl border bg-white dark:bg-[#161619] flex flex-col gap-2.5 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                          isDragging
                            ? "opacity-30 scale-95 border-dashed border-[#c19c5c]"
                            : isDragOver
                            ? "border-[#c19c5c] ring-2 ring-[#c19c5c] scale-[1.02] shadow-md"
                            : "border-black/10 dark:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0" />
                          
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
                            <img src={proj.images?.[0] || "/placeholder.png"} alt={proj.title} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase bg-black/10 dark:bg-white/10 text-black dark:text-white">
                                #{globalIdx + 1}
                              </span>
                              <span className="text-[10px] font-mono text-[#c19c5c] uppercase truncate">
                                {proj.category}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-black dark:text-white truncate">
                              {proj.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveToTop(globalIdx)}
                              className="px-2 py-0.5 rounded bg-[#c19c5c]/15 text-[#c19c5c] text-[9px] font-mono font-bold hover:bg-[#c19c5c]/25 transition-colors cursor-pointer"
                              title="Make #1 Top"
                            >
                              Make #1
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProject(globalIdx, -1)}
                              className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            {globalIdx < projects.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveProject(globalIdx, 1)}
                                className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-black/60 dark:text-white/60"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(proj)}
                              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(proj.id)}
                              className="p-1.5 rounded text-red-500/80 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL RENDERED VIA PORTAL */}
      {mounted && modalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div 
            className="bg-white dark:bg-[#0f0f12] border-0 sm:border border-black/10 dark:border-white/10 rounded-none sm:rounded-3xl w-full h-[100dvh] max-h-[100dvh] sm:h-[90vh] sm:max-h-[920px] max-w-5xl flex flex-col shadow-2xl relative overflow-hidden"
            data-lenis-prevent="true"
          >
            
            {/* Sticky Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0f0f12]/95 backdrop-blur-md flex-shrink-0 z-20">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-9 h-9 rounded-xl bg-[#c19c5c]/10 border border-[#c19c5c]/30 flex items-center justify-center text-[#c19c5c] flex-shrink-0">
                  {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#c19c5c] font-bold">
                      {isEditing ? "EDIT WORK ENTRY" : "NEW WORK ENTRY"}
                    </span>
                    {isEditing && formData.id && (
                      <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 truncate max-w-[220px]">
                        id: {formData.id}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-xl font-serif font-bold text-black dark:text-white truncate">
                    {isEditing ? (formData.title || "Untitled Project") : "Add New Work to Portfolio"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form 
              id="admin-project-form"
              onSubmit={handleSubmitProject} 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-8 py-5 sm:py-6"
              style={{ WebkitOverflowScrolling: "touch" }}
              data-lenis-prevent="true"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* ── LEFT COLUMN: Core Details & Settings (6 cols) ── */}
                <div className="lg:col-span-6 flex flex-col gap-5">
                  
                  {/* Section Title */}
                  <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
                    <FileText className="w-4 h-4 text-[#c19c5c]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/80 dark:text-white/80">
                      Project Information
                    </span>
                  </div>

                  {/* Project Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center justify-between">
                      <span>Project Title <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: val,
                          // Auto-populate slug only if creating
                          id: !isEditing && !prev.id ? val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : prev.id,
                        }));
                      }}
                      placeholder="e.g. AI Financial Dashboard"
                      required
                      className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Slug / ID */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center justify-between">
                      <span>Slug / Unique URL ID <span className="text-red-500">*</span></span>
                      {isEditing && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked in edit mode
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={isEditing}
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') })}
                        placeholder="e.g. ai-financial-dashboard"
                        required
                        className={`w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors ${
                          isEditing 
                            ? "bg-black/[0.04] dark:bg-white/[0.04] text-black/50 dark:text-white/50 cursor-not-allowed pr-10" 
                            : "bg-white/70 dark:bg-black/30"
                        }`}
                      />
                      {isEditing && (
                        <Lock className="w-4 h-4 text-black/30 dark:text-white/30 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>

                  {/* Category & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#c19c5c]" />
                        <span>Category <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Full-Stack Web App"
                        required
                        className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c19c5c]" />
                        <span>Year</span>
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="2026"
                        className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Live / GitHub Link */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#c19c5c]" />
                      <span>Live Demo or Repository Link</span>
                    </label>
                    <input
                      type="text"
                      value={formData.detailsLink}
                      onChange={(e) => setFormData({ ...formData, detailsLink: e.target.value })}
                      placeholder="https://github.com/..."
                      className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#c19c5c]" />
                        Tech Stack
                      </span>
                      <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
                        Comma separated
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.stack}
                      onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                      placeholder="React, Next.js, Node.js, MongoDB, Tailwind CSS"
                      className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none transition-colors"
                    />

                    {/* Live Tech Stack Tags Preview */}
                    {formData.stack && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {formData.stack.split(",").map((s) => s.trim()).filter(Boolean).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#c19c5c]/10 text-[#c19c5c] border border-[#c19c5c]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visibility & Showcase Card */}
                  <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-[#c19c5c] focus:ring-[#c19c5c] accent-[#c19c5c] cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-[#c19c5c]" /> Featured Project
                        </span>
                        <p className="text-[11px] text-black/50 dark:text-white/50">
                          Highlight this project prominently in showcases
                        </p>
                      </div>
                    </label>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-black/70 dark:text-white/70 font-semibold">
                          Index # (Rank):
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                          className="w-16 px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-xs font-mono text-center focus:border-[#c19c5c] focus:outline-none font-bold text-[#c19c5c]"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#c19c5c]">
                        #1 appears at top of portfolio
                      </span>
                    </div>
                  </div>

                </div>

                {/* ── RIGHT COLUMN: Content & Cloudinary Media (6 cols) ── */}
                <div className="lg:col-span-6 flex flex-col gap-5">
                  
                  {/* Section Title */}
                  <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
                    <Sparkles className="w-4 h-4 text-[#c19c5c]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/80 dark:text-white/80">
                      Descriptions &amp; Media
                    </span>
                  </div>

                  {/* Short Description */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                        Short Description (Card Summary) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                        {formData.desc?.length || 0} chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      placeholder="A punchy 1-2 sentence hook displayed on work cards and the homepage..."
                      required
                      className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none resize-none transition-colors"
                    />
                  </div>

                  {/* Detailed Overview */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-black/70 dark:text-white/70">
                      Detailed Project Overview (Full Page Story)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="In-depth breakdown of the architecture, goals, challenges, and implementation..."
                      className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-base sm:text-sm focus:border-[#c19c5c] focus:outline-none resize-none transition-colors"
                    />
                  </div>

                  {/* Media Gallery / Cloudinary Photo Manager */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col gap-4">
                    
                    {/* Media Header & Upload Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-[#c19c5c]" /> Cloudinary Photos
                          </h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#c19c5c]/15 text-[#c19c5c] font-bold border border-[#c19c5c]/30">
                            Auto-WebP 80%
                          </span>
                        </div>
                        <p className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                          Upload screenshots or mockups directly into Cloudinary <code className="font-mono text-[10px]">portfoliophoto</code>.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Upload Files</span>
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

                    {/* Add Image via Direct URL Input */}
                    <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="relative flex-1">
                        <Link2 className="w-3.5 h-3.5 text-black/40 dark:text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={manualImageUrl}
                          onChange={(e) => setManualImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddManualImage();
                            }
                          }}
                          placeholder="Or paste external image URL (https://...)"
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 text-black dark:text-white text-xs focus:border-[#c19c5c] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddManualImage}
                        disabled={!manualImageUrl.trim()}
                        className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white text-xs font-mono font-bold transition-colors disabled:opacity-30 cursor-pointer flex-shrink-0"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Image Cards Grid */}
                    {formData.images.length === 0 ? (
                      <div className="py-8 px-4 rounded-xl border border-dashed border-black/20 dark:border-white/20 text-center flex flex-col items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-black/30 dark:text-white/30 mb-2" />
                        <p className="text-xs text-black/60 dark:text-white/60 font-medium">
                          No images attached yet
                        </p>
                        <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">
                          At least one image is required for portfolio showcase.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.images.map((imgUrl, idx) => {
                          const isCover = idx === 0;
                          return (
                            <div 
                              key={idx} 
                              className={`relative aspect-video rounded-xl overflow-hidden group border bg-black flex flex-col justify-between transition-all ${
                                isCover 
                                  ? "border-[#c19c5c] ring-2 ring-[#c19c5c]/40" 
                                  : "border-black/10 dark:border-white/10"
                              }`}
                            >
                              <img 
                                src={imgUrl} 
                                alt={`Project image ${idx + 1}`} 
                                className="w-full h-full object-cover" 
                              />
                              
                              {/* Top Bar: Cover Badge or Make Cover */}
                              <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 z-10">
                                {isCover ? (
                                  <span className="bg-[#c19c5c] text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                                    ★ COVER
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverImage(idx)}
                                    className="bg-black/75 hover:bg-[#c19c5c] hover:text-black text-white font-mono text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm transition-colors cursor-pointer"
                                    title="Promote to cover photo"
                                  >
                                    Set Cover
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 rounded bg-red-600/90 hover:bg-red-600 text-white transition-colors cursor-pointer shadow"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Bottom Bar: Reorder buttons */}
                              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                                <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                                  #{idx + 1}
                                </span>

                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, -1)}
                                      className="p-1 rounded bg-black/80 hover:bg-black text-white transition-colors cursor-pointer"
                                      title="Move earlier"
                                    >
                                      <ChevronLeft className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx < formData.images.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, 1)}
                                      className="p-1 rounded bg-black/80 hover:bg-black text-white transition-colors cursor-pointer"
                                      title="Move later"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>

              </div>
            </form>

            {/* Sticky Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-3.5 sm:py-4 border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0f0f12]/95 backdrop-blur-md flex-shrink-0 z-20 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                  formData.images.length > 0 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}>
                  {formData.images.length > 0 ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{formData.images.length} {formData.images.length === 1 ? "image" : "images"}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>Image required</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  form="admin-project-form"
                  disabled={submitting}
                  className="px-5 sm:px-8 py-2.5 rounded-xl bg-[#c19c5c] hover:bg-[#b08b4d] active:scale-95 text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#c19c5c]/20 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{isEditing ? "Save Changes" : "Create Project"}</span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
