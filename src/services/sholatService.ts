import { prayerApi } from "@/lib/axios";
import type { PrayerTimings, Koordinat } from "@/types";

interface JadwalByKoordinatParams extends Koordinat {
  date: string;
}

interface JadwalByKotaParams {
  kota: string;
  negara?: string;
  bulan: number;
  tahun: number;
}

interface AladhanTimingsResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimings;
    date: Record<string, unknown>;
    meta: Record<string, unknown>;
  };
}

export const sholatService = {
  async getJadwalByKoordinat({ lat, lng, date }: JadwalByKoordinatParams): Promise<PrayerTimings> {
    const { data } = await prayerApi.get<AladhanTimingsResponse>(`/timings/${date}`, {
      params: {
        latitude: lat,
        longitude: lng,
        method: 11,
      },
    });
    return data.data.timings;
  },

  async getJadwalByKota({ kota, negara = "ID", bulan, tahun }: JadwalByKotaParams): Promise<PrayerTimings[]> {
    const { data } = await prayerApi.get<{ data: Array<{ timings: PrayerTimings }> }>(`/calendarByCity/${tahun}/${bulan}`, { params: { city: kota, country: negara, method: 11 } });
    return data.data.map((d: { timings: PrayerTimings }) => d.timings);
  },
};
