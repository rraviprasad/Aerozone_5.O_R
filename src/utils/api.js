/**
 * API fetching utility with fallback between local backend and remote Render.com backend.
 * Local is tried first (via Vite proxy /api), then remote Render.com if local fails or times out.
 */

const LOCAL_URL = "/api/data";
const REMOTE_BASE_URL = "https://aerozone3-1.onrender.com/api/data";

/**
 * Robust fetch that tries local backend first, then remote as fallback.
 * @param {string} endpoint - The relative path (e.g., "/get-data" or "/prism")
 * @param {Object} options - Standard fetch options
 * @returns {Promise<Response>}
 */
export async function fetchWithFallback(endpoint, options = {}) {
    const relativeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Priority 1: Try Local (via Proxy)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for local

        const localResponse = await fetch(`${LOCAL_URL}${relativeEndpoint}`, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (localResponse.ok) {
            const data = await localResponse.clone().json();
            if (data && (!Array.isArray(data) || data.length > 0)) {
                return localResponse;
            }
        }
    } catch (error) {
        console.warn(`Local backend fetch failed for ${relativeEndpoint}, falling back to remote:`, error.message);
    }

    // Priority 2: Fallback to Remote
    try {
        const remoteUrl = `${REMOTE_BASE_URL}${relativeEndpoint}`;
        const remoteResponse = await fetch(remoteUrl, options);

        if (!remoteResponse.ok) {
            throw new Error(`Remote API returned status ${remoteResponse.status}`);
        }

        return remoteResponse;
    } catch (error) {
        console.error(`Remote fallback failed for ${relativeEndpoint}:`, error.message);
        throw error;
    }
}
