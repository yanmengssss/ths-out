import { parse } from "node-html-parser"; // 确保安装 node-html-parser
import axios from "axios";
import iconv from "iconv-lite";
import * as XLSX from "xlsx";
const keyList = [
  "day",
  "code",
  "price",
  "number",
  "count",
  "buy",
  "sail",
  "type",
];
export async function getPageData(query) {
  let url = `http://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/dzjy/index.phtml?p=${
    query.page || 1
  }`;
  if (query["code"]) url += "&symbol=" + query["code"];
  if (query["start"]) url += "&bdate=" + query["start"];
  if (query["end"]) url += "&edate=" + query["end"];
  const res = await axios.get(url, {
    headers: {
      pragma: "no-cache",
      priority: "u=0, i",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "arraybuffer", // 获取原始 Buffer
  });
  // GBK -> UTF-8
  const html = iconv.decode(res.data, "gbk");
  //   console.log(html);
  // 解析 HTML
  const root = parse(html);
  const rows = root
    .querySelectorAll("tr")
    .map((tr) => tr.querySelectorAll("td").map((td) => td.text.trim()));
  const result = [];
  rows.forEach((item) => {
    const temp = {};
    Object.keys(keyList).forEach((key, index) => {
      temp[keyList[key]] = item[index];
    });
    result.push(temp);
  });
  return { rows: result, page: query.page };
}

export const exportExcel = (code, exp, type) => {
  fetch(
    `http://basic.10jqka.com.cn/api/stock/export.php?export=${exp}&type=${type}&code=${code}`,
    {
      credentials: "include", // 保证带上 Cookies
    }
  )
    .then((res) => res.blob())
    .then((blob) => {
      // 创建临时下载链接
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${exp}-${type}-${code}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
};
//导出数据为excel文件
export const exportWithExcel = (data, name = "导出数据") => {
  if (!data || data.length === 0) {
    console.warn("没有可导出的数据");
    return;
  }

  // 1️⃣ 创建工作表和工作簿
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 2️⃣ 将 workbook 写成二进制数据（不直接下载）
  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array", // 生成 ArrayBuffer
  });

  // 3️⃣ 创建 Blob
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // 4️⃣ 创建 <a> 标签并模拟点击下载
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.xlsx`;
  document.body.appendChild(a);
  a.click();

  // 5️⃣ 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getTableHead = async () => {
  const res = await getPageData({ page: 1 });

  const { rows } = res;
  const head = rows[0];
  return head;
};
