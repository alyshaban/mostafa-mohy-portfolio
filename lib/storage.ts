export const IMAGE_BUCKET = "portfolio-images";

type StorageClient = {
  storage: {
    from: (bucket: string) => {
      remove: (paths: string[]) => Promise<{ error: Error | null }>;
    };
  };
};

export async function removeStorageImage(
  supabase: StorageClient,
  storagePath?: string | null,
) {
  if (!storagePath) return null;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .remove([storagePath]);

  return error;
}
