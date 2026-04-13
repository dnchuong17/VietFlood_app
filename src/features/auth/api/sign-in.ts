import type {
  AuthProfile,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  UpdateProfilePayload,
} from "@/features/auth/types/auth";

const DEFAULT_AUTH_API_BASE_URL = "https://vietflood-app.azurewebsites.net";

const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? DEFAULT_AUTH_API_BASE_URL;

function extractErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (Array.isArray(message)) {
      const firstMessage = message.find(
        (item) => typeof item === "string" && item.trim().length > 0,
      );

      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản.";
}

function isSignInResponse(data: unknown): data is SignInResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const tokenByCamel = (data as { accessToken?: unknown }).accessToken;
  const tokenBySnake = (data as { access_token?: unknown }).access_token;

  return (
    (typeof tokenByCamel === "string" && tokenByCamel.trim().length > 0) ||
    (typeof tokenBySnake === "string" && tokenBySnake.trim().length > 0)
  );
}

function normalizeTokens(data: unknown): SignInResponse {
  if (typeof data !== "object" || data === null) {
    throw new Error("Phản hồi token không hợp lệ từ máy chủ.");
  }

  const raw = data as {
    accessToken?: unknown;
    access_token?: unknown;
    refreshToken?: unknown;
    refresh_token?: unknown;
  };

  const accessToken =
    typeof raw.accessToken === "string" && raw.accessToken.trim().length > 0
      ? raw.accessToken
      : typeof raw.access_token === "string" &&
          raw.access_token.trim().length > 0
        ? raw.access_token
        : "";

  const refreshToken =
    typeof raw.refresh_token === "string" && raw.refresh_token.trim().length > 0
      ? raw.refresh_token
      : typeof raw.refreshToken === "string" &&
          raw.refreshToken.trim().length > 0
        ? raw.refreshToken
        : undefined;

  if (!accessToken) {
    throw new Error("Không nhận được access token từ máy chủ.");
  }

  return {
    accessToken,
    refresh_token: refreshToken,
  };
}

function isAuthProfile(data: unknown): data is AuthProfile {
  return typeof data === "object" && data !== null;
}

function extractRole(profile: AuthProfile | null): string | null {
  if (!profile || typeof profile.role !== "string") {
    return null;
  }

  return profile.role.trim().toLowerCase();
}

type SignInOptions = {
  allowedRoles?: string[];
};

export async function getProfile(
  accessToken: string,
): Promise<AuthProfile | null> {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  if (!isAuthProfile(data)) {
    return null;
  }

  return data as AuthProfile;
}

export async function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
): Promise<void> {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/update`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = extractErrorMessage(data);

    throw new Error(
      errorMessage ===
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản."
        ? "Cập nhật thông tin thất bại. Vui lòng thử lại."
        : errorMessage,
    );
  }
}

export async function signIn(
  payload: SignInPayload,
  options: SignInOptions = {},
): Promise<SignInResponse> {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/sign_in`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  if (!isSignInResponse(data)) {
    throw new Error("Phản hồi đăng nhập không hợp lệ từ máy chủ.");
  }

  const tokens = normalizeTokens(data);

  // Optional: validate role if allowedRoles is explicitly provided
  if (options.allowedRoles && options.allowedRoles.length > 0) {
    const profile = await getProfile(tokens.accessToken);
    const role = extractRole(profile);
    const allowedRoles = options.allowedRoles.map((item) =>
      item.trim().toLowerCase(),
    );

    if (!role || !allowedRoles.includes(role)) {
      throw new Error("Tài khoản này không có quyền truy cập vào ứng dụng.");
    }
  }

  return tokens;
}

export async function signUp(payload: SignUpPayload): Promise<void> {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      role: "citizen",
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  if (typeof data === "object" && data !== null && "error" in data) {
    throw new Error(extractErrorMessage(data));
  }
}

/**
 * Refresh access token using refresh token
 * @param refreshToken The refresh token
 * @returns New access token and refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<SignInResponse> {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/refresh_token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // If refresh fails, clear session
    throw new Error(
      extractErrorMessage(data) || "Không thể làm mới phiên đăng nhập.",
    );
  }

  return normalizeTokens(data);
}
