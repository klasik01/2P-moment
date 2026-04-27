import { useState } from "react";
import type { ProfileName } from "../../config/profiles";
import { getActiveProfiles, setActiveProfiles } from "../../config/profiles";
import { backend } from "../../services";
import { cs } from "../../i18n";

const ALL_PROFILES: { value: ProfileName; label: string }[] = [
  { value: "VE_VYSTAVBE", label: cs.profiles.veVystavbe },
  { value: "BEZ_REKLAMY", label: cs.profiles.bezReklamy },
];

/**
 * Select box v patičce pro přepínání aktivního profilu aplikace.
 * Uloží nastavení do Firestore a provede reload stránky.
 */
export function ProfileSelector() {
  const [saving, setSaving] = useState(false);
  const active = getActiveProfiles();

  const handleChange = async (profile: ProfileName, checked: boolean) => {
    const next = checked
      ? [...active, profile]
      : active.filter((p) => p !== profile);

    setSaving(true);
    try {
      setActiveProfiles(next);
      await backend.saveAppSettings({ activeProfiles: next });
      window.location.reload();
    } catch (err) {
      console.error("[ProfileSelector] Save failed:", err);
      setSaving(false);
    }
  };

  return (
    <div className="profile-selector">
      <span className="profile-selector-label">{cs.profiles.label}</span>
      <div className="profile-selector-options">
        {ALL_PROFILES.map(({ value, label }) => (
          <label key={value} className="profile-selector-option">
            <input
              type="checkbox"
              checked={active.includes(value)}
              onChange={(e) => handleChange(value, e.target.checked)}
              disabled={saving}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {saving && <span className="profile-selector-saving">{cs.common.saving}</span>}
    </div>
  );
}
