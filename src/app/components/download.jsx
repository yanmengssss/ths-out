"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const list = [
  { exp: "debt", type: "report" },
  { exp: "benefit", type: "report" },
  { exp: "cash", type: "report" },
];
export default function DownloadButton() {
  const [data, setData] = useState("");

  const handleGetData = async () => {
    // list.forEach((item) => {
    //   exportExcel(data, item.exp, item.type);
    // });
    try {
      const res = await axios.get(`/api/getExcel?code=${data}`, {
        responseType: "blob", // ✅ 必须：让 axios 以二进制流返回
      });
      // 创建一个 Blob URL 供下载
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 创建临时 <a> 元素触发下载
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data}.xlsx`; // ✅ 文件名
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // ✅ 释放内存
    } catch (err) {
      console.error("下载失败:", err);
      alert("下载失败，请稍后再试");
    }
  };

  return (
    <Card className="bg-black mx-auto mt-3 w-full max-w-md shadow-xl text-white">
      <CardHeader>
        <CardTitle>个股资金流向数据</CardTitle>
        <CardDescription>请输入后对应代码后导出</CardDescription>
        <CardAction>
          <Button onClick={handleGetData}>导出</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
