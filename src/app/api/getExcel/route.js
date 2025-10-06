import axios from "axios";
import * as XLSX from "xlsx";

/**
 * 合并三个导出接口为一个 Excel 文件（含三个 sheet）
 * @example /api/merge-excel?code=600000
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return new Response("参数缺失: code", { status: 400 });
  }

  // 你要导出的三个配置
  const list = [
    { exp: "baseinfo", type: "main", name: "基本信息" },
    { exp: "finance", type: "detail", name: "财务数据" },
    { exp: "holder", type: "data", name: "股东信息" },
  ];

  try {
    // 1️⃣ 并行下载三个 Excel 文件（都是 Blob 数据）
    const responses = await Promise.all(
      list.map((item) =>
        axios.get(
          `http://basic.10jqka.com.cn/api/stock/export.php?export=${item.exp}&type=${item.type}&code=${code}`,
          { responseType: "arraybuffer" } // 以二进制获取
        )
      )
    );

    // 2️⃣ 把每个文件解析为工作簿对象
    const workbooks = responses.map((res) =>
      XLSX.read(res.data, { type: "buffer" })
    );

    // 3️⃣ 创建一个新的总工作簿
    const mergedWb = XLSX.utils.book_new();

    // 4️⃣ 从每个下载的文件中取出第一个 sheet，加入到总工作簿
    workbooks.forEach((wb, idx) => {
      const sheetName = list[idx].name;
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      XLSX.utils.book_append_sheet(mergedWb, sheet, sheetName);
    });

    // 5️⃣ 将合并后的工作簿写出为二进制
    const excelBuffer = XLSX.write(mergedWb, {
      bookType: "xlsx",
      type: "array",
    });

    // 6️⃣ 返回文件流给前端
    return new Response(Buffer.from(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${code}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("合并出错：", err);
    return new Response("导出失败", { status: 500 });
  }
}
