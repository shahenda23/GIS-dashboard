// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { DashboardConfig } from "../features/builder/types/builder.types";
// import { useTheme } from "../context/ThemeContext";
// import Navbar from "../features/dashboard/components/Navbar";
// import DashboardCard from "../features/dashboard/components/DashboardCard";
// import ShareModal from "../features/dashboard/components/ShareModal";
// import Footer from '../features/dashboard/components/Footer'

// const labels = {
//   en: {
//     title: "My Dashboards",
//     subtitle: "Manage your interactive geospatial visualization projects.",
//     newCard: "Create New Dashboard",
//     newSub: "Start from a template or blank",
//     emptyTitle: "No dashboards yet",
//     emptySub: "Create your first GIS dashboard to get started",
//     emptyBtn: "+ Create Dashboard",
//   },
//   ar: {
//     title: "لوحاتي",
//     subtitle: "إدارة مشاريع التصور الجغرافي التفاعلية.",
//     newCard: "إنشاء لوحة جديدة",
//     newSub: "ابدأ من قالب أو صفحة فارغة",
//     emptyTitle: "لا توجد لوحات بعد",
//     emptySub: "أنشئ أول لوحة GIS للبدء",
//     emptyBtn: "+ إنشاء لوحة",
//   },
// };

// function HomePage() {
//   const navigate = useNavigate();
//   const { lang } = useTheme();
//   const [dashboards, setDashboards] = useState<DashboardConfig[]>([])
//   const [shareModalId, setShareModalId] = useState<string | null>(null);
//   const t = labels[lang];

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
//     setDashboards(saved)
//   }, [])

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--page-bg)", display: "flex", flexDirection: "column" }}>
//       <Navbar onNewDashboard={() => navigate("/templates")} />

//       <main
//         style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", flex: 1, width: "100%" }}
//       >
// {/* Hero */}
// <div style={{
//   marginBottom: '32px',
//   paddingBottom: '24px',
//   borderBottom: '1px solid var(--border)',
// }}>
//   <div style={{
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '6px',
//   }}>
//     <h1 style={{
//       fontSize: '32px',
//       fontWeight: '800',
//       color: 'var(--text-primary)',
//       letterSpacing: '-0.6px',
//       margin: 0,
//     }}>
//       {t.title}
//     </h1>
//     <span style={{
//       width: '32px',
//       height: '32px',
//       borderRadius: '50%',
//       border: '1.5px solid var(--accent)',
//       color: 'var(--accent)',
//       fontSize: '13px',
//       fontWeight: '700',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexShrink: 0,
//     }}>
//       {dashboards.length}
//     </span>
//   </div>
//   <p style={{
//     fontSize: '14px',
//     color: 'var(--text-secondary)',
//     maxWidth: '520px',
//     lineHeight: '1.6',
//     margin: 0,
//   }}>
//     {t.subtitle}
//   </p>
// </div>

//         {/* Grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//             gap: "16px",
//           }}
//         >
//           {/* Create New Card */}
//           <div
//             onClick={() => navigate("/templates")}
//             style={{
//               background: "var(--surface)",
//               border: "1.5px dashed var(--border-strong)",
//               borderRadius: "var(--radius-xl)",
//               minHeight: "200px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               cursor: "pointer",
//               transition: "border-color 0.15s, background 0.15s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = "var(--accent)";
//               e.currentTarget.style.background = "var(--accent-light)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "var(--border-strong)";
//               e.currentTarget.style.background = "var(--surface)";
//             }}
//           >
//             <div
//               style={{
//                 width: "60px",
//                 height: "60px",
//                 borderRadius: "50%",
//                 border: "1.5px solid var(--border-strong)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 color: "var(--text-muted)",
//               }}
//             >
//               +
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <p
//                 style={{
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   color: "var(--text-primary)",
//                   marginBottom: "2px",
//                 }}
//               >
//                 {t.newCard}
//               </p>
//               <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
//                 {t.newSub}
//               </p>
//             </div>
//           </div>

//           {/* Dashboard Cards */}
//           {dashboards.map((dashboard) => (
//             <DashboardCard
//               key={dashboard.id}
//               dashboard={{
//                 id: dashboard.id,
//                 title: dashboard.title,
//                 description: '',
//                 editedAt: 'just now',
//                 widgetCount: dashboard.widgets.length,
//                 thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
//                 status: 'live',
//               }}
//               onOpen={(id) => navigate(`/builder/${id}`)}
//               onEdit={(id) => navigate(`/builder/${id}`)}
//               onPreview={(id) => navigate(`/dashboard/${id}`)}
//               onShare={(id) => setShareModalId(id)}
//               onDelete={(id) => {
//                 const saved = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
//                 localStorage.setItem('gis-dashboards', JSON.stringify(saved.filter((d: any) => d.id !== id)))
//                 setDashboards(prev => prev.filter(d => d.id !== id))
//               }}
//             />
//           ))}
//         </div>
//       </main>

//       {shareModalId && (
//         <ShareModal
//           dashboardId={shareModalId}
//           onClose={() => setShareModalId(null)}
//         />
//       )}
//       <Footer />
//     </div>
//   );
// }

// export default HomePage;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";
import Navbar from "../features/dashboard/components/Navbar";
import DashboardCard from "../features/dashboard/components/DashboardCard";
import ShareModal from "../features/dashboard/components/ShareModal";
import Footer from '../features/dashboard/components/Footer'
import AppLoader from '../components/AppLoader'

const labels = {
  en: {
    title: "My Dashboards",
    subtitle: "Manage your interactive geospatial visualization projects.",
    newCard: "Create New Dashboard",
    newSub: "Start from a template or blank",
  },
  ar: {
    title: "لوحاتي",
    subtitle: "إدارة مشاريع التصور الجغرافي التفاعلية.",
    newCard: "إنشاء لوحة جديدة",
    newSub: "ابدأ من قالب أو صفحة فارغة",
  },
};

function timeAgo(dateStr: string, lang: 'en' | 'ar'): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return lang === 'en' ? 'just now'       : 'الآن'
  if (mins  < 60) return lang === 'en' ? `${mins}m ago`   : `منذ ${mins} دقيقة`
  if (hours < 24) return lang === 'en' ? `${hours}h ago`  : `منذ ${hours} ساعة`
  return lang === 'en' ? `${days}d ago` : `منذ ${days} يوم`
}

function HomePage() {
  const navigate = useNavigate();
  const { lang } = useTheme();
  const [dashboards, setDashboards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [shareModalId, setShareModalId] = useState<string | null>(null);
  const t = labels[lang];

  // ── fetch from Supabase ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchDashboards() {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .order('updated_at', { ascending: false })
      if (!error && data) setDashboards(data)
      setLoading(false)
    }
    fetchDashboards()
  }, [])

  // ── delete from Supabase ─────────────────────────────────────────────────
  async function handleDelete(id: string) {
    await supabase.from('dashboards').delete().eq('id', id)
    setDashboards(prev => prev.filter(d => d.id !== id))
  }

  if (loading) return <AppLoader />

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar onNewDashboard={() => navigate("/templates")} />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", flex: 1, width: "100%" }}>

        {/* Hero */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.6px', margin: 0 }}>
              {t.title}
            </h1>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '1.5px solid var(--accent)', color: 'var(--accent)',
              fontSize: '13px', fontWeight: '700',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {dashboards.length}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: '1.6', margin: 0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>

          {/* Create New Card */}
          <div
            onClick={() => navigate("/templates")}
            style={{
              background: "var(--surface)", border: "1.5px dashed var(--border-strong)",
              borderRadius: "var(--radius-xl)", minHeight: "200px",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "8px", cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.background = "var(--surface)";
            }}
          >
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", color: "var(--text-muted)",
            }}>
              +
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>
                {t.newCard}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {t.newSub}
              </p>
            </div>
          </div>

          {/* Dashboard Cards */}
          {dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={{
                id:           dashboard.id,
                title:        dashboard.title,
                description:  '',
                editedAt:     timeAgo(dashboard.updated_at, lang),
                widgetCount:  dashboard.widgets?.length ?? 0,
                thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
                status:       'live',
              }}
              onOpen={    id => navigate(`/builder/${id}`)}
              onEdit={    id => navigate(`/builder/${id}`)}
              onPreview={ id => navigate(`/dashboard/${id}`)}
              onShare={   id => setShareModalId(id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {shareModalId && (
        <ShareModal dashboardId={shareModalId} onClose={() => setShareModalId(null)} />
      )}
      <Footer />
    </div>
  );
}

export default HomePage;