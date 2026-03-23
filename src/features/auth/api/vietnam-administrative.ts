export type VnWard = {
  code: number;
  name: string;
};

export type VnProvince = {
  code: number;
  name: string;
  wards: VnWard[];
};

const DEFAULT_VN_ADMIN_API_URL = "https://provinces.open-api.vn/api/?depth=3";

type RawProvince = {
  code?: unknown;
  name?: unknown;
  districts?: unknown;
};

type RawSubArea = {
  code?: unknown;
  name?: unknown;
  wards?: unknown;
};

function isWard(value: unknown): value is VnWard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const raw = value as { code?: unknown; name?: unknown };
  return typeof raw.code === "number" && typeof raw.name === "string";
}

function isSubArea(value: unknown): value is RawSubArea {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const raw = value as { code?: unknown; name?: unknown; wards?: unknown };
  return (
    typeof raw.code === "number" &&
    typeof raw.name === "string" &&
    Array.isArray(raw.wards) &&
    raw.wards.every(isWard)
  );
}

function isRawProvince(value: unknown): value is RawProvince {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const raw = value as RawProvince;
  return (
    typeof raw.code === "number" &&
    typeof raw.name === "string" &&
    Array.isArray(raw.districts) &&
    raw.districts.every(isSubArea)
  );
}

function toUniqueWards(wards: VnWard[]): VnWard[] {
  const seen = new Set<number>();
  const unique: VnWard[] = [];

  for (const ward of wards) {
    if (seen.has(ward.code)) {
      continue;
    }

    seen.add(ward.code);
    unique.push(ward);
  }

  return unique;
}

function toProvince(raw: RawProvince): VnProvince {
  const code = raw.code as number;
  const name = raw.name as string;
  const subAreas = raw.districts as RawSubArea[];

  const allWards = subAreas.flatMap((item) => item.wards as VnWard[]);

  return {
    code,
    name,
    wards: toUniqueWards(allWards),
  };
}

export async function fetchVietnamAdministrativeUnits(
  apiUrl: string = DEFAULT_VN_ADMIN_API_URL,
): Promise<VnProvince[]> {
  const response = await fetch(apiUrl, {
    method: "GET",
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error("Không thể tải dữ liệu địa giới hành chính.");
  }

  if (!Array.isArray(data) || !data.every(isRawProvince)) {
    throw new Error("Dữ liệu địa giới hành chính không hợp lệ.");
  }

  return data.map(toProvince);
}
