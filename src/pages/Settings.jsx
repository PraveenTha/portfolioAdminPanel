import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const ICONS = [
  { id: "github", label: "GitHub", icon: "FaGithub" },
  { id: "stackoverflow", label: "Stack Overflow", icon: "FaStackOverflow" },
  { id: "reddit", label: "Reddit", icon: "FaReddit" },
  { id: "discord", label: "Discord", icon: "FaDiscord" },
  { id: "slack", label: "Slack", icon: "FaSlack" },
  { id: "devto", label: "Dev.to", icon: "FaDev" },
  { id: "hashnode", label: "Hashnode", icon: "SiHashnode" },
  { id: "linkedin", label: "LinkedIn", icon: "FaLinkedin" },
  { id: "wellfound", label: "Wellfound", icon: "SiAngellist" },
  { id: "twitter", label: "X (Twitter)", icon: "FaXTwitter" },
  { id: "youtube", label: "YouTube", icon: "FaYoutube" },
  { id: "twitch", label: "Twitch", icon: "FaTwitch" },
  { id: "kick", label: "Kick", icon: "SiKick" },
  { id: "medium", label: "Medium", icon: "FaMedium" },
  { id: "substack", label: "Substack", icon: "SiSubstack" },
  { id: "freecodecamp", label: "FreeCodeCamp", icon: "FaFreeCodeCamp" },
  { id: "geeksforgeeks", label: "GeeksforGeeks", icon: "SiGeeksforgeeks" },
  { id: "gitlab", label: "GitLab", icon: "FaGitlab" },
  { id: "bitbucket", label: "Bitbucket", icon: "FaBitbucket" },
  { id: "sourceforge", label: "SourceForge", icon: "SiSourceforge" },
  { id: "codepen", label: "CodePen", icon: "FaCodepen" },
  { id: "jsfiddle", label: "JSFiddle", icon: "FaJs" },
  { id: "dribbble", label: "Dribbble", icon: "FaDribbble" },
  { id: "behance", label: "Behance", icon: "FaBehance" },
  { id: "telegram", label: "Telegram", icon: "FaTelegram" },
  { id: "whatsapp", label: "WhatsApp", icon: "FaWhatsapp" },
  { id: "hackernews", label: "Hacker News", icon: "FaHackerNews" },
  { id: "producthunt", label: "Product Hunt", icon: "FaProductHunt" },
  { id: "quora", label: "Quora", icon: "FaQuora" },
];

const Settings = () => {
  const [socials, setSocials] = useState([]);

  // 🔹 Fetch existing settings
  useEffect(() => {
    api.get("/admin/settings").then((res) => {
      if (res.data?.socials?.length) {
        setSocials(res.data.socials);
      }
    });
  }, []);

  // 🔹 Update single field
  const update = (index, field, value) => {
    setSocials((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // 🔹 Add new social row
  const add = () => {
    setSocials((prev) => [
      ...prev,
      {
        _id: Date.now(), // 🔥 stable key (IMPORTANT)
        platform: "",
        icon: "",
        url: "",
        enabled: true,
      },
    ]);
  };

  // 🔹 Save to backend
  const save = async () => {
    await api.put("/admin/settings", { socials });
    alert("Social media updated ✅");
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <h4 className="color-white">Social Media (Global)</h4>

        {socials.map((s, i) => (
          <div key={s._id || i} className="border rounded p-3 mb-3">
            {/* Platform Select */}
            <select
              className="form-control mb-2"
              value={s.platform}
              onChange={(e) => {
                const value = e.target.value;
                const selected = ICONS.find((x) => x.id === value);
                if (!selected) return;

                update(i, "platform", value);
                update(i, "icon", selected.icon);
              }}
            >
              <option value="">Select Platform</option>
              {ICONS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>

            {/* URL */}
            <input
              className="form-control mb-2"
              placeholder="Profile URL / mailto"
              value={s.url}
              onChange={(e) => update(i, "url", e.target.value)}
            />

            {/* Enabled */}
            <label className="text-light">
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) => update(i, "enabled", e.target.checked)}
              />{" "}
              Enabled
            </label>
          </div>
        ))}

        <button className="btn btn-outline-light w-100 mb-2" onClick={add}>
          + Add Social Icon
        </button>

        <button className="btn btn-primary w-100" onClick={save}>
          Save
        </button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
