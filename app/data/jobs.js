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
 *           EASYJOBS_PLUGIN_VERSION to the current version on
 *           wordpress.org/plugins/easyjobs.
 *   Shape:  { data: { jobs: { data: [...], total, per_page, current_page } } }
 *
 * `job/published` includes EXPIRED postings (it means "not draft", not "open"),
 * so expired roles are filtered out here — otherwise the career page would list
 * openings that closed years ago.
 *
 * Failure policy: never throw. The career page must render either real jobs or
 * its "not hiring" empty state, never a 500. On failure we serve the last known
 * good result if we have one, so a brief API outage doesn't make an actively
 * hiring company look closed.
 */

const REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Env is read per-call, not at module load: in some server setups the module is
// imported before the environment is fully populated, which would otherwise
// leave the key permanently empty.
const config = () => ({
  base: process.env.EASYJOBS_API_URL || "https://app.easy.jobs/api/v1",
  key: process.env.EASYJOBS_API_KEY || "",
  pluginVersion: process.env.EASYJOBS_PLUGIN_VERSION || "2.8.1",
});

/** Last successful fetch, used for both caching and outage fallback. */
let cache = { at: 0, jobs: null };

/** Human-readable location: "Remote", or "City, Country". */
function formatLocation(raw) {
  if (raw.is_remote) {
    const scope = raw.remote_location_type?.name;
    return scope && scope !== "Anywhere" ? `Remote (${scope})` : "Remote";
  }

  const addr = raw.job_address || {};
  const parts = [addr.city?.name, addr.state?.name, addr.country?.name]
    .filter(Boolean)
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
 * Map the raw list defensively: a single malformed record must not take the
 * whole page down with it, so each job is converted in isolation and bad ones
 * are skipped.
 */
function normalizeList(list) {
  const jobs = [];

  for (const raw of list) {
    try {
      if (!raw || typeof raw !== "object") continue;
      if (raw.is_expired) continue;
      if (raw.show_on_career_page === 0) continue;
      if (!raw.title) continue;
      jobs.push(normalizeJob(raw));
    } catch (error) {
      console.error(
        `[jobs] skipping malformed job ${raw?.id ?? "(no id)"}:`,
        error.message
      );
    }
  }

  return jobs.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
}

/** Serve the previous good result on failure, else an empty list. */
function fallback(reason) {
  if (cache.jobs) {
    console.error(`[jobs] ${reason} — serving last known good result.`);
    return cache.jobs;
  }
  console.error(`[jobs] ${reason} — showing the empty state.`);
  return [];
}

/**
 * Open positions, pinned first.
 * Always resolves; never throws.
 */
export async function getOpenJobs() {
  const { base, key, pluginVersion } = config();

  if (!key) {
    console.warn("[jobs] EASYJOBS_API_KEY is not set — showing the empty state.");
    return [];
  }

  if (cache.jobs && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.jobs;
  }

  try {
    const res = await fetch(`${base}/job/published?rows=50&paginate=true`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "x-plugin-version": pluginVersion,
        "x-state-version": "0",
        Accept: "application/json",
      },
      // Without this a hung easy.jobs would block the career page render
      // indefinitely — fetch has no default timeout.
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      const hint =
        res.status === 401
          ? " (check EASYJOBS_API_KEY)"
          : res.status === 403
            ? " (easy.jobs may require a newer EASYJOBS_PLUGIN_VERSION)"
            : "";
      return fallback(`easy.jobs responded HTTP ${res.status}${hint}`);
    }

    let payload;
    try {
      payload = await res.json();
    } catch {
      return fallback("easy.jobs returned a non-JSON response");
    }

    if (payload?.status !== "success") {
      const message = payload?.data?.message || payload?.status || "unknown error";
      return fallback(`easy.jobs returned status "${message}"`);
    }

    const list = payload?.data?.jobs?.data;
    if (!Array.isArray(list)) {
      return fallback("easy.jobs response was missing data.jobs.data");
    }

    const jobs = normalizeList(list);
    cache = { at: Date.now(), jobs };
    return jobs;
  } catch (error) {
    const reason =
      error.name === "TimeoutError" || error.name === "AbortError"
        ? `easy.jobs did not respond within ${REQUEST_TIMEOUT_MS}ms`
        : `easy.jobs request failed: ${error.message}`;
    return fallback(reason);
  }
}
