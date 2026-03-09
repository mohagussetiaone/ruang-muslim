import { api } from "@/lib/axios";
import type { ApiResponse, Surah, SurahDetail, Tafsir } from "@/types";

export const quranService = {
  async getSurahList(): Promise<Surah[]> {
    const { data } = await api.get<Surah[]>("/surah");
    return data;
  },

  async getSurahDetail(id: number | string): Promise<SurahDetail> {
    const { data } = await api.get<SurahDetail>(`/surah/${id}`);
    return data;
  },

  async getTafsir(id: number | string): Promise<Tafsir> {
    const { data } = await api.get<ApiResponse<Tafsir>>(`/tafsir/${id}`);
    return data.data;
  },
};
