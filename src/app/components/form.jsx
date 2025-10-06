"use client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ 校验日期格式函数
const isValidDate = (dateStr) => {
  if (!dateStr) return true;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export default function MyForm({ submit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      start: "",
      end: "",
      pageSize: "",
      pageCount: "",
    },
  });

  // ✅ 提交逻辑
  const onSubmit = (values) => {
    // console.log("✅ 校验通过:", values);
    submit(values);
  };

  return (
    <Card className="bg-black pb-1 mx-auto mt-1 w-full max-w-md shadow-xl text-white">
      <CardHeader>
        <CardTitle>大宗交易数据导出</CardTitle>
        <CardDescription>请输入后进行对应下载操作</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-1">
            {/* === 证券代码 === */}
            <Field>
              <FieldLabel>证券代码</FieldLabel>
              <Input
                placeholder="请输入证券简称或代码，若不存在则搜索全部"
                {...register("code", {
                  validate: (value) => {
                    if (value === "" || /^[0-9A-Za-z]{6}$/.test(value)) {
                      return true;
                    }
                    return "请输入6位有效的证券代码";
                  },
                })}
              />
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>

            {/* === 开始日期 === */}
            <Field>
              <FieldLabel>开始日期</FieldLabel>
              <Input
                placeholder="格式：2023-01-01"
                {...register("start", {
                  validate: (v) => isValidDate(v) || "日期格式应为 YYYY-MM-DD",
                })}
              />
              <FieldDescription>格式：YYYY-MM-DD</FieldDescription>
              {errors.start && <FieldError>{errors.start.message}</FieldError>}
            </Field>

            {/* === 结束日期 === */}
            <Field>
              <FieldLabel>结束日期</FieldLabel>
              <Input
                placeholder="格式：2023-01-31"
                {...register("end", {
                  validate: (v) => isValidDate(v) || "日期格式应为 YYYY-MM-DD",
                })}
              />
              <FieldDescription>格式：YYYY-MM-DD</FieldDescription>
              {errors.end && <FieldError>{errors.end.message}</FieldError>}
            </Field>

            {/* === 每页数量 === */}
            <Field>
              <FieldLabel>每页数量</FieldLabel>
              <Input
                placeholder="默认为40"
                {...register("pageSize", {
                  validate: (v) =>
                    v === "" ||
                    (/^\d+$/.test(v) && Number(v) > 0) ||
                    "请输入正整数",
                })}
              />
              {errors.pageSize && (
                <FieldError>{errors.pageSize.message}</FieldError>
              )}
            </Field>

            {/* === 页数量 === */}
            <Field>
              <FieldLabel>页数量</FieldLabel>
              <Input
                placeholder="默认为8"
                {...register("pageCount", {
                  validate: (v) =>
                    v === "" ||
                    (/^\d+$/.test(v) && Number(v) > 0) ||
                    "请输入正整数",
                })}
              />
              {errors.pageCount && (
                <FieldError>{errors.pageCount.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            variant="outline"
            className="bg-white text-black hover:opacity-80 w-full mt-4"
          >
            开始导出
          </Button>
        </form>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
// ✅ 声明 props 类型
MyForm.propTypes = {
  submit: PropTypes.func, // 提交回调函数
};
