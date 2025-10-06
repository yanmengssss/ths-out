// app/api/getPage/route.ts
import { NextResponse } from "next/server";
import { getPageData } from "../../../app/utils";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  // await initCookie();
  let index = 0;
  let count = searchParams.get("count") || 8;
  const result = new Array(count + 1).fill(null);
  // 创建一个Promise来等待所有数据加载完成
  return new Promise((resolve) => {
    for (let i = 1; i <= count; i++) {
      getPageData({
        ...Object.fromEntries(searchParams.entries()),
        page: i,
      }).then((res) => {
        const { rows, page } = res;
        result[page] = rows.slice(1);
        index++;
        if (index === count) {
          resolve(NextResponse.json(result));
        }
      });
    }
  });
}
