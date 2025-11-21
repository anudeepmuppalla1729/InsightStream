import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Keep this list in sync with backend avatarList
const avatarList = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
];

const AvatarSelectPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);

  const [selected, setSelected] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selected || !token) return;

    try {
      setSaving(true);
      await updateAvatar(selected, token);
      toast.success("Avatar updated");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-lg mx-auto px-4 mt-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Choose Your Avatar
        </h1>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 mb-10">
          {avatarList.map((av) => {
            const isActive = av === selected;
            return (
              <button
                key={av}
                onClick={() => setSelected(av)}
                className={`
                  rounded-xl aspect-square overflow-hidden border 
                  transition-all duration-200
                  ${
                    isActive
                      ? "border-gold-600 ring-2 ring-gold-400"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
              >
                <img
                  src={`/avatars/${av}`}
                  alt={av}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Save */}
        <button
          disabled={!selected || saving}
          onClick={handleSave}
          className={`
            w-full py-3 rounded-xl text-white font-medium transition
            ${
              saving || !selected
                ? "bg-gold-300 cursor-not-allowed"
                : "bg-gold-700 hover:bg-gold-800 active:scale-[0.98]"
            }
          `}
        >
          {saving ? "Saving..." : "Save Avatar"}
        </button>
      </div>
    </>
  );
};

export default AvatarSelectPage;
