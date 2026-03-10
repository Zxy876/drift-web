export const DEFAULT_DRIFT_BACKEND_URL = "http://127.0.0.1:8000";

export function getDriftBackendBaseUrl(): string {
  const envUrl =
    process.env.DRIFT_BACKEND_URL ||
    process.env.NEXT_PUBLIC_DRIFT_BACKEND_URL ||
    DEFAULT_DRIFT_BACKEND_URL;

  return String(envUrl).trim().replace(/\/+$/, "");
}

export type WorldStatePayload = Record<string, unknown>;
export type NarrativeGraphPayload = Record<string, unknown>;
export type ScenesLibraryPayload = Record<string, unknown>;
export type GenerationPolicyPayload = {
  scene_cooldown: number;
  spawn_probability: number;
  max_scenes_per_hour: number;
  spawn_distance: number;
  require_player_movement: boolean;
  require_new_location: boolean;
};
export type IntentTracePayload = {
  world_state: WorldStatePayload | null;
  debug_tasks: Record<string, unknown> | null;
  debug_tasks_status: number | null;
  debug_tasks_error: string | null;
};

function normalizeBaseUrl(baseUrlOverride?: string): string {
  const override = String(baseUrlOverride || "").trim();
  if (override) {
    return override.replace(/\/+$/, "");
  }
  return getDriftBackendBaseUrl();
}

function asGenerationPolicy(value: unknown): GenerationPolicyPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const row = value as Record<string, unknown>;

  const sceneCooldown = Number(row.scene_cooldown);
  const spawnProbability = Number(row.spawn_probability);
  const maxScenesPerHour = Number(row.max_scenes_per_hour);
  const spawnDistance = Number(row.spawn_distance);

  if (!Number.isFinite(sceneCooldown)) {
    return null;
  }
  if (!Number.isFinite(spawnProbability)) {
    return null;
  }
  if (!Number.isFinite(maxScenesPerHour)) {
    return null;
  }
  if (!Number.isFinite(spawnDistance)) {
    return null;
  }

  return {
    scene_cooldown: sceneCooldown,
    spawn_probability: spawnProbability,
    max_scenes_per_hour: maxScenesPerHour,
    spawn_distance: spawnDistance,
    require_player_movement: Boolean(row.require_player_movement),
    require_new_location: Boolean(row.require_new_location),
  };
}

export async function fetchWorldState(playerId: string): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: WorldStatePayload | null;
  error: string | null;
}> {
  const normalizedPlayerId = String(playerId || "").trim();
  const baseUrl = getDriftBackendBaseUrl();

  if (!normalizedPlayerId) {
    return {
      ok: false,
      status: 400,
      baseUrl,
      data: null,
      error: "playerId is required",
    };
  }

  const requestUrl = `${baseUrl}/world/state/${encodeURIComponent(normalizedPlayerId)}`;

  try {
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    let payload: WorldStatePayload | null = null;
    try {
      payload = (await response.json()) as WorldStatePayload;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        baseUrl,
        data: payload,
        error: `backend returned ${response.status}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      baseUrl,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function fetchNarrativeGraph(): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: NarrativeGraphPayload | null;
  error: string | null;
}> {
  const baseUrl = getDriftBackendBaseUrl();
  const requestUrl = `${baseUrl}/narrative/graph`;

  try {
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    let payload: NarrativeGraphPayload | null = null;
    try {
      payload = (await response.json()) as NarrativeGraphPayload;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        baseUrl,
        data: payload,
        error: `backend returned ${response.status}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      baseUrl,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function fetchScenesLibrary(): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: ScenesLibraryPayload | null;
  error: string | null;
}> {
  const baseUrl = getDriftBackendBaseUrl();
  const requestUrl = `${baseUrl}/scenes/library`;

  try {
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    let payload: ScenesLibraryPayload | null = null;
    try {
      payload = (await response.json()) as ScenesLibraryPayload;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        baseUrl,
        data: payload,
        error: `backend returned ${response.status}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      baseUrl,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function fetchGenerationPolicy(baseUrlOverride?: string): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: GenerationPolicyPayload | null;
  error: string | null;
}> {
  const baseUrl = normalizeBaseUrl(baseUrlOverride);
  const requestUrl = `${baseUrl}/settings/generation`;

  try {
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    let rawPayload: unknown = null;
    try {
      rawPayload = await response.json();
    } catch {
      rawPayload = null;
    }

    const payload = asGenerationPolicy(rawPayload);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        baseUrl,
        data: payload,
        error: `backend returned ${response.status}`,
      };
    }

    if (!payload) {
      return {
        ok: false,
        status: 502,
        baseUrl,
        data: null,
        error: "invalid generation policy schema",
      };
    }

    return {
      ok: true,
      status: response.status,
      baseUrl,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function updateGenerationPolicy(
  policy: GenerationPolicyPayload,
  baseUrlOverride?: string,
): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: GenerationPolicyPayload | null;
  error: string | null;
}> {
  const baseUrl = normalizeBaseUrl(baseUrlOverride);
  const requestUrl = `${baseUrl}/settings/generation`;

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });

    let rawPayload: unknown = null;
    try {
      rawPayload = await response.json();
    } catch {
      rawPayload = null;
    }

    const payload = asGenerationPolicy(rawPayload);

    if (!response.ok) {
      const detail =
        rawPayload && typeof rawPayload === "object" && !Array.isArray(rawPayload) && typeof (rawPayload as Record<string, unknown>).detail === "string"
          ? String((rawPayload as Record<string, unknown>).detail)
          : `backend returned ${response.status}`;
      return {
        ok: false,
        status: response.status,
        baseUrl,
        data: payload,
        error: detail,
      };
    }

    if (!payload) {
      return {
        ok: false,
        status: 502,
        baseUrl,
        data: null,
        error: "invalid generation policy schema",
      };
    }

    return {
      ok: true,
      status: response.status,
      baseUrl,
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function fetchIntentTrace(playerId: string): Promise<{
  ok: boolean;
  status: number;
  baseUrl: string;
  data: IntentTracePayload | null;
  error: string | null;
}> {
  const normalizedPlayerId = String(playerId || "").trim();
  const worldResult = await fetchWorldState(normalizedPlayerId);

  if (!normalizedPlayerId) {
    return {
      ok: false,
      status: 400,
      baseUrl: worldResult.baseUrl,
      data: null,
      error: "playerId is required",
    };
  }

  let debugPayload: Record<string, unknown> | null = null;
  let debugStatus: number | null = null;
  let debugError: string | null = null;

  const debugUrl = `${worldResult.baseUrl}/world/story/${encodeURIComponent(normalizedPlayerId)}/debug/tasks`;
  try {
    const debugResponse = await fetch(debugUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    debugStatus = debugResponse.status;

    try {
      const parsed = (await debugResponse.json()) as Record<string, unknown>;
      debugPayload = parsed;
    } catch {
      debugPayload = null;
    }

    if (!debugResponse.ok) {
      const detail =
        typeof debugPayload?.detail === "string"
          ? debugPayload.detail
          : `backend returned ${debugResponse.status}`;
      debugError = detail;
    }
  } catch (error) {
    debugStatus = 503;
    debugError = error instanceof Error ? error.message : "network error";
  }

  const payload: IntentTracePayload = {
    world_state: worldResult.data,
    debug_tasks: debugPayload,
    debug_tasks_status: debugStatus,
    debug_tasks_error: debugError,
  };

  if (!worldResult.ok) {
    return {
      ok: false,
      status: worldResult.status,
      baseUrl: worldResult.baseUrl,
      data: payload,
      error: worldResult.error,
    };
  }

  return {
    ok: true,
    status: worldResult.status,
    baseUrl: worldResult.baseUrl,
    data: payload,
    error: null,
  };
}
