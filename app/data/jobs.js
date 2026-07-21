/**
 * Job data layer — easy.jobs (https://app.easy.jobs/api/v1).
 *
 * This is the only module that talks to easy.jobs. Post a job in the easy.jobs
 * dashboard and it appears on /career automatically — nothing to edit here.
 *
 * Endpoint: GET /job/published
 *   Auth:   Authorization: Bearer <EASYJOBS_API_KEY>
 *   NOTE:   the API also requires an `x-plugin-version` header. Without it every
 *           request fails with 403 "Your plugin version is outdated." The value
 *           tracks their WordPress plugin, so if calls start 403-ing, bump
 *           PLUGIN_VERSION to the current version on wordpress.org/plugins/easyjobs.
 *   Shape:  { data: { jobs: { data: [...], total, per_page, current_page } } }
 *
 * `job/published` includes EXPIRED postings (it means "not draft", not "open"),
 * so expired roles are filtered out here — otherwise the career page would list
 * openings that closed years ago.
 */

const API_BASE = process.env.EASYJOBS_API_URL || "https://app.easy.jobs/api/v1";
const API_KEY = process.env.EASYJOBS_API_KEY || "";
const PLUGIN_VERSION = process.env.EASYJOBS_PLUGIN_VERSION || "2.8.1";

/** Human-readable location: "Remote", or "City, Country". */
function formatLocation(raw) {
  if (raw.is_remote) {
    const scope = raw.remote_location_type?.name;
    return scope && scope !== "Anywhere" ? `Remote (${scope})` : "Remote";
  }

  const addr = raw.job_address || {};
  const parts = [addr.city?.name, addr.state?.name, addr.country?.name]
    .filter(Boolean)
    // "Dhaka, Dhaka, Bangladesh" reads badly — drop a state that repeats the city.
    .filter((part, i, arr) => arr.indexOf(part) === i);

  if (parts.length === 0) return raw.company_name || "";
  // City + country is enough; the state in between is noise.
  return parts.length > 2 ? `${parts[0]}, ${parts[parts.length - 1]}` : parts.join(", ");
}

function normalizeJob(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title || "",
    location: formatLocation(raw),
    // Already formatted by the API, e.g. "20 Oct, 2024".
    deadline: raw.expire_at || "",
    postedAt: raw.posted_at || "",
    daysLeft: raw.days_left || "",
    vacancies: raw.vacancies ?? null,
    category: raw.category?.name || "",
    salary: raw.salary || "",
    jobType: raw.job_type || "",
    isRemote: Boolean(raw.is_remote),
    isPinned: Boolean(raw.is_pinned),
    applyUrl: raw.apply_url || raw.job_link || "",
    detailsUrl: raw.job_link || "",
  };
}

/**
 * Open positions, pinned first then soonest-posted.
 * Returns [] on any failure so the career page degrades to its empty state
 * rather than erroring.
 */
export async function getOpenJobs() {
  if (!API_KEY) {
    console.warn("[jobs] EASYJOBS_API_KEY is not set — no jobs will be shown.");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE}/job/published?rows=50&paginate=true`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "x-plugin-version": PLUGIN_VERSION,
        "x-state-version": "0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`[jobs] easy.jobs request failed: HTTP ${res.status}`);
      return [];
    }

    const payload = await res.json();
    if (payload?.status !== "success") {
      console.error("[jobs] easy.jobs returned:", payload?.data?.message || payload?.status);
      return [];
    }

    const list = payload?.data?.jobs?.data;
    if (!Array.isArray(list)) return [];

    return list
      .filter((job) => !job.is_expired && job.show_on_career_page !== 0)
      .map(normalizeJob)
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  } catch (error) {
    console.error("[jobs] easy.jobs request threw:", error.message);
    return [];
  }
}
