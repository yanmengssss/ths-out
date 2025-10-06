// app/api/getPage/route.ts
import { NextResponse } from "next/server";
import { getTableHead } from "../../../app/utils";

export async function GET() {
  // 创建一个Promise来等待所有数据加载完成
  return new Promise((resolve) => {
    getTableHead().then((res) => {
      resolve(NextResponse.json(res));
    });
  });
}
