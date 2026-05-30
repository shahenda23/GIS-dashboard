import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useBuilderStore } from "../store/builderStore";
import ShareModal from "../../dashboard/components/ShareModal";
import logoUrl from "../../../assets/logo.svg";

function BuilderTopBar() {
  const navigate = useNavigate();
  const { lang } = useTheme();
  const dashboardTitle = useBuilderStore(s => s.dashboardTitle)
  const isSaved        = useBuilderStore(s => s.isSaved)
  const isSaving       = useBuilderStore(s => s.isSaving)
  const setTitle       = useBuilderStore(s => s.setTitle)
  const saveDashboard  = useBuilderStore(s => s.saveDashboard)
  const isPublic   = useBuilderStore(s => s.isPublic)
  const setPublic  = useBuilderStore(s => s.setPublic)
  const [isEditing, setIsEditing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [pendingNav, setPendingNav] = useState("/");

  const t = {
    en: {
      saved: "Saved",
      save: "Save",
      unsaved: "Unsaved changes",
      share: "Share",
      publish: "Publish",
      preview: "Preview",
    },
    ar: {
      saved: "محفوظ",
      save: "حفظ",
      unsaved: "تغييرات غير محفوظة",
      share: "مشاركة",
      publish: "نشر",
      preview: "معاينة",
    },
  }[lang];

  async function handleSave() {
    await saveDashboard();
  }

  function guardedNav(to: string) {
    if (!isSaved) {
      setPendingNav(to);
      setShowUnsaved(true);
    } else {
      navigate(to);
    }
  }

  return (
    <>
      <div
        style={{
          height: "52px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left — Back + Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Back button */}
          <button
            onClick={() => guardedNav("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "var(--radius-md)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--page-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }}
            >
              <path d="M11 14L6 9l5-5" />
            </svg>
          </button>

          {/* Logo */}
          <img src={logoUrl} alt="logo" style={{ width: "28px", height: "28px", borderRadius: "var(--radius-md)", flexShrink: 0 }} />

          {/* Editable Title */}
          {isEditing ? (
            <input
              autoFocus
              value={dashboardTitle}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-primary)",
                border: "none",
                borderBottom: "1.5px solid var(--accent)",
                outline: "none",
                background: "transparent",
                width: "200px",
                padding: "2px 0",
              }}
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              title={lang === "en" ? "Click to rename" : "اضغط للتعديل"}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-primary)",
                cursor: "text",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--page-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {dashboardTitle}
            </span>
          )}

          {/* Save status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke={isSaved ? "#22c55e" : "var(--text-muted)"}
              strokeWidth="1.5"
            >
              {isSaved ? (
                <polyline points="2 6 5 9 10 3" />
              ) : (
                <circle cx="6" cy="6" r="5" />
              )}
            </svg>
            {isSaved ? t.saved : t.unsaved}
          </div>
        </div>

        {/* Right — Preview + Save + Share + Publish */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Preview button */}
          <button
            onClick={() => navigate("/dashboard/preview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--page-bg)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" />
              <circle cx="7" cy="7" r="1.5" />
            </svg>
            {t.preview}
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSaved || isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: isSaved && !isSaving ? "var(--page-bg)" : "var(--accent)",
              border: `1px solid ${isSaved && !isSaving ? "var(--border)" : "var(--accent)"}`,
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              color: isSaved && !isSaving ? "var(--text-muted)" : "#fff",
              cursor: isSaved || isSaving ? "default" : "pointer",
              fontWeight: "500",
              transition: "all 0.15s",
              opacity: isSaved && !isSaving ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaved && !isSaving)
                e.currentTarget.style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              if (!isSaved && !isSaving)
                e.currentTarget.style.background = "var(--accent)";
            }}
          >
            {isSaving ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="6.5" cy="6.5" r="5" strokeOpacity="0.3" />
                <path d="M6.5 1.5a5 5 0 0 1 5 5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 11H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6l2 2v6a1 1 0 0 1-1 1z" />
                <path d="M8 11V7H5v4" />
                <path d="M5 2v3h4" />
              </svg>
            )}
            {isSaving ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : isSaved ? t.saved : t.save}
          </button>

          {/* Share button */}
          <button
            onClick={() => setShowShare(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--page-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="3" r="1.5" />
              <circle cx="3" cy="7" r="1.5" />
              <circle cx="11" cy="11" r="1.5" />
              <path d="M4.5 6.5l5-2.5M4.5 7.5l5 2.5" />
            </svg>
            {t.share}
          </button>

          {/* Publish toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "var(--page-bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-primary)",
                fontWeight: "500",
              }}
            >
              {t.publish}
            </span>
            <div
              onClick={async () => {
                setPublic(!isPublic)
                await saveDashboard()
              }}
              style={{
                width: "36px",
                height: "20px",
                background: isPublic ? "var(--accent)" : "var(--border-strong)",
                borderRadius: "20px",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: isPublic ? "19px" : "3px",
                  width: "14px",
                  height: "14px",
                  background: "#fff",
                  borderRadius: "50%",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareModal dashboardId="preview" onClose={() => setShowShare(false)} />
      )}

      {/* Unsaved Changes Modal */}
      {showUnsaved && (
        <div
          onClick={() => setShowUnsaved(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              padding: "32px",
              width: "400px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--text-primary)",
              }}
            >
              {lang === "ar" ? "تغييرات غير محفوظة" : "Unsaved Changes"}
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                color: "var(--text-secondary)",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {lang === "ar"
                ? "لديك تغييرات غير محفوظة. إذا خرجت الآن ستُفقد جميع التغييرات."
                : "You have unsaved changes. If you leave now, all your changes will be lost."}
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={async () => {
                  await saveDashboard();
                  navigate(pendingNav);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "var(--accent)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                {lang === "ar" ? "حفظ" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowUnsaved(false);
                  navigate(pendingNav);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#ef4444",
                  fontWeight: "500",
                }}
              >
                {lang === "ar" ? "تجاهل" : "Ignore"}
              </button>
              <button
                onClick={() => setShowUnsaved(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  fontWeight: "500",
                }}
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BuilderTopBar;
