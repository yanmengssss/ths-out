"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportExcel } from "@/app/utils";
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
    list.forEach((item) => {
      exportExcel(data, item.exp, item.type);
    });
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
