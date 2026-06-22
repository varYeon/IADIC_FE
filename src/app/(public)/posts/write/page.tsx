"use server";

import { redirect } from "next/navigation";
import Toast from "@/components/common/toast/Toast";
import PostForm from "@/components/post/PostForm";
import { createPost, updatePost } from "@/services/post/post.server";
import { FormState } from "@/types";
import { achievePost } from "@/utils/achieve/server";
import { createClient } from "@/utils/supabase/server";

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ page: string; id: string }> }) {
  const supabase = await createClient();
  const { page, id } = await searchParams;

  const { data } = await supabase.from("category").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    Toast({ message: "로그인이 필요한 기능입니다.", type: "ERROR" });
    redirect("/login");
  }

  if (page === "new") {
    async function writePost(prevState: FormState, formData: FormData): Promise<FormState> {
      "use server";

      const supabase = await createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        return {
          success: false,
          error: "로그인이 필요합니다.",
          result: null,
        };
      }

      const categoryId = formData.get("category_id")?.toString() ?? "";
      const title = formData.get("title")?.toString() ?? "";
      const content = formData.get("content")?.toString() ?? "";
      const imgFile = formData.get("upload_image") as File;

      if (!categoryId || !title || !content) {
        return {
          success: false,
          error: "입력 값을 모두 채워주세요.",
          result: null,
        };
      }

      // supabase에 post 데이터 insert
      const [state, data] = await createPost({
        user_id: user.id,
        category_id: categoryId,
        title: title,
        content: content,
      });

      if (!state.success) return state;

      if (imgFile && imgFile.size > 0) {
        const fileExt = imgFile.name.split(".").pop();
        const fileName = `${user.id}${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from("user_upload_image").upload(fileName, imgFile);

        if (error) {
          return {
            success: false,
            error: "이미지 업로드 실패",
            result: null,
          };
        } else {
          const { data: image } = supabase.storage.from("user_upload_image").getPublicUrl(fileName);

          const [updateState, updateData] = await updatePost(data?.id ? data.id : "", { post_image: image.publicUrl });

          if (!updateState?.success) return state;

          // 뱃지, 경험치
          const result = await achievePost(user.id, categoryId);

          return {
            success: true,
            error: null,
            result: result,
          };
        }
      }

      // 뱃지, 경험치
      const result = await achievePost(user.id, categoryId);

      return {
        success: true,
        error: null,
        result: result,
      };
    }

    return <PostForm categorys={data ?? []} action={writePost} />;
  } else if (page === "edit") {
    async function editPost(prevState: FormState, formData: FormData): Promise<FormState> {
      "use server";

      const supabase = await createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        return {
          success: false,
          error: "로그인이 필요합니다.",
          result: null,
        };
      }

      const categoryId = formData.get("category_id")?.toString() ?? "";
      const title = formData.get("title")?.toString() ?? "";
      const content = formData.get("content")?.toString() ?? "";
      const imgFile = formData.get("upload_image") as File;

      if (!categoryId || !title || !content) {
        return {
          success: false,
          error: "입력 값을 모두 채워주세요.",
          result: null,
        };
      }

      // supabase에 post 데이터 update
      const [state] = await updatePost(id, {
        user_id: user.id,
        category_id: categoryId,
        title: title,
        content: content,
      });

      if (!state.success) return state;

      if (imgFile && imgFile.size > 0) {
        // 기존 이미지 삭제
        const originalUrl = formData.get("original_image")?.toString() ?? "";
        const filePath = originalUrl.replace(
          "https://lfkxloulmqeonuzaudtt.supabase.co/storage/v1/object/public/user_upload_image/",
          ""
        );
        const { error: removeImageError } = await supabase.storage.from("user_upload_image").remove([filePath]);

        if (removeImageError)
          return {
            success: false,
            error: "기존 이미지 삭제 실패",
            result: null,
          };

        // 수정 이미지 추가
        const fileExt = imgFile.name.split(".").pop();
        const fileName = `${user.id}${crypto.randomUUID()}.${fileExt}`;

        const { error } = await supabase.storage.from("user_upload_image").upload(fileName, imgFile);

        if (error) {
          return {
            success: false,
            error: "이미지 업로드 실패",
            result: null,
          };
        } else {
          const { data: image } = supabase.storage.from("user_upload_image").getPublicUrl(fileName);

          const [updateState] = await updatePost(id, { post_image: image.publicUrl });

          if (!updateState?.success) return state;

          return {
            success: true,
            error: null,
            result: null,
          };
        }
      }

      return {
        success: true,
        error: null,
        result: null,
      };
    }

    const { data: postData, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

    if (!error) {
      return <PostForm categorys={data ?? []} action={editPost} postData={postData ?? null} />;
    }
  }
}
