import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Setting, SettingCategory, SettingType } from "@/types";

export async function GET() {
  try {
    const siteSetting = await prisma.siteSetting.findMany({
      orderBy: { order: "asc" },
    });

    // Format settings untuk frontend - pastikan konsisten
    const settings = siteSetting.reduce<Record<string, Setting>>((acc, setting) => {
      // PERBAIKAN: Pastikan value selalu string untuk CSS variables
      let value = setting.value;
      
      // Untuk boolean, konversi ke string 'true'/'false'
      if (setting.type === "boolean") {
        value = setting.value === "true" ? "true" : "false";
      }
      // Untuk number, tetap string karena CSS butuh string
      else if (setting.type === "number") {
        value = setting.value; // sudah string
      }
      // Untuk JSON, kita stringify lagi untuk CSS
      else if (setting.type === "json") {
        try {
          value = JSON.stringify(JSON.parse(setting.value));
        } catch {
          value = setting.value;
        }
      }
      
      acc[setting.key] = {
        id: setting.id,
        key: setting.key,
        value: value, // Selalu string untuk konsistensi
        type: setting.type as SettingType,
        category: setting.category as SettingCategory,
        label: setting.label,
        description: setting.description || undefined,
        options: setting.options ? JSON.parse(setting.options) : [],
        order: setting.order,
        createdAt: setting.createdAt.toISOString(),
        updatedAt: setting.updatedAt.toISOString(),
      };
      return acc;
    }, {});

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}