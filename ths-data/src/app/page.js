"use client";
import axios from "axios";
import { exportWithExcel } from "./utils";
import MyForm from "./components/form.jsx";
import DownloadButton from "./components/download.jsx";

export default function Home() {
  const handleGetAllData = async (query) => {
    try {
      // console.log(query);
      const data = await axios.get("/api/getPage", { params: query });
      const head = await axios.get("/api/getHead");
      let td = [head.data];
      data.data.forEach((item) => {
        //合并数组
        if (item) {
          td = [...td, ...item];
        }
      });
      exportWithExcel(td, "导出数据");
    } catch (error) {
      console.error("处理数据时出错:", error);
      // 这里可以添加错误处理逻辑，如显示错误消息
    }
  };
  return (
    <>
      {/* <div>
        <button onClick={handleGetAllData}>导出excel</button>
      </div> */}
      <DownloadButton />
      <MyForm submit={handleGetAllData} />
    </>
  );
}
