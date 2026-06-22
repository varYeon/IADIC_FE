"use client";

import { ChevronLeft, ImagePlus } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { CategoryType, FormState, PostType } from "@/types";
import CategoryDropdown from "./CategoryDropdown";
import { Button } from "../common/Button";
import ResponsiveContainer from "../common/ResponsiveContainer";
import Toast from "../common/toast/Toast";

export default function PostForm({
  categorys,
  action,
  postData,
}: {
  categorys: CategoryType[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  postData?: PostType | null;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: null,
    result: null,
  });

  const router = useRouter();

  const [preview, setPreview] = useState(postData ? postData.post_image : "");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      Toast({ message: "1MB 이하의 이미지만 업로드 할 수 있습니다.", type: "ERROR" });
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      Toast({ message: "이미지 파일만 업로드할 수 있습니다.", type: "ERROR" });
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const categoryType = Object.values(categorys).find(c => c.id === postData?.category_id)?.type ?? "";

  useEffect(() => {
    if (state.error) {
      Toast({ message: state.error, type: "ERROR" });
    } else if (state.success && !state.error) {
      if (postData) {
        Toast({ message: "게시글이 성공적으로 수정되었습니다.", type: "SUCCESS" });
        redirect(`/posts/${categoryType}/post/${postData.id}`);
      } else {
        Toast({ message: "게시글이 성공적으로 등록되었습니다.", type: "SUCCESS" });
        state.result?.forEach(res => {
          Toast({ message: `${res.badgeName} 뱃지를 획득하셨습니다!`, type: "SUCCESS" });
          if (res.leveledUp) Toast({ message: `${res.newLevel} 레벨업!`, type: "SUCCESS" });
        });
        redirect("/posts");
      }
    }
  }, [state]);
  return (
    <ResponsiveContainer className="post-form bg-bg-main scrollbar-hide relative mx-5 mb-5 flex h-full flex-col overflow-auto max-sm:mx-0 max-sm:border-none">
      <form action={formAction} className="flex flex-col justify-between gap-6 px-6 py-5">
        <div className="post-form_rows flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-title flex items-center text-2xl font-bold">
              <button
                type="button"
                onClick={() => {
                  router.back();
                }}
                className="hover:text-main mr-5 cursor-pointer"
              >
                <ChevronLeft />
              </button>
              게시글 {postData ? "수정" : "작성"}
            </h1>
            <p className="text-text-light">어떤 글에 훈수를 받고 싶나요?</p>
          </div>
          <div className="post-form_row flex flex-col gap-1.5">
            <h2 className="text-text-title text-base">카테고리</h2>
            <CategoryDropdown categorys={categorys} selectCategoryId={postData?.category_id} />
          </div>
          <div className="post-form_row flex flex-col gap-1.5">
            <h2 className="text-text-title text-base">제목</h2>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              name="title"
              defaultValue={postData ? postData.title : ""}
              className="text-text-sub focus:border-text-sub placeholder:text-text-light border-border-main flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-4 outline-0 hover:cursor-auto"
            />
          </div>
          <div className="post-form_row flex flex-col gap-1.5">
            <h2 className="text-text-title text-base">내용</h2>
            <textarea
              placeholder="내용을 입력하세요"
              wrap="hard"
              name="content"
              defaultValue={postData ? (postData.content ?? "") : ""}
              className="text-text-sub focus:border-text-sub placeholder:text-text-light border-border-main flex h-60 w-full cursor-pointer resize-none items-center justify-between rounded-xl border px-3 py-4 outline-0 hover:cursor-auto"
            />
          </div>
          <div className="post-form_row flex flex-col gap-1.5">
            <h2 className="text-text-title text-base">이미지 첨부</h2>
            <label
              htmlFor="imageUpload"
              className="bg-bg-sub hover:bg-border-sub relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all"
            >
              {preview ? (
                <Image src={preview} alt="preview" fill className="object-cover" />
              ) : (
                <ImagePlus size={40} className="text-gray-400" />
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              name="upload_image"
              id="imageUpload"
              className="hidden"
              onChange={handleFileChange}
            />
            <input type="hidden" name="original_image" value={postData?.post_image ?? ""} />
          </div>
        </div>
        <div className="post-form_btns flex justify-end gap-3">
          <Button
            variant="quaternary"
            size="sm"
            className={`hover:bg-main-50 dark:hover:bg-main/20 max-sm:w-full`}
            type="reset"
            onClick={() => {
              setPreview("");
            }}
          >
            초기화
          </Button>
          <Button variant="primary" size="sm" className="max-sm:w-full" type="submit" disabled={isPending}>
            {postData ? (isPending ? "수정중..." : "수정") : isPending ? "등록중..." : "등록"}
          </Button>
        </div>
      </form>
    </ResponsiveContainer>
  );
}
