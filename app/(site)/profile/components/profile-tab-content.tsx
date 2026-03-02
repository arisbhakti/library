"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useAppToast } from "@/components/ui/app-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAuthToken,
  getAuthUser,
  saveAuthUser,
  type LoginUser,
  type UserRole,
} from "@/lib/auth";
import {
  fetchMyProfile,
  type MyProfileData,
  tanstackQueryKeys,
  updateMyProfile,
  useMyProfileQuery,
} from "@/lib/tanstack-api";

const DEFAULT_AVATAR = "/dummy-avatar.png";
const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024;
const allowedProfilePhotoTypes = ["image/png", "image/jpeg", "image/jpg"];
const phoneRegex = /^0\d{8,14}$/;

type ProfileFormValues = {
  name: string;
  phone: string;
  profilePhoto: File | null;
};

type ProfileFormErrors = Partial<Record<keyof ProfileFormValues | "form", string>>;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resolveProfilePhoto(profilePhoto: string | null | undefined): string {
  if (!profilePhoto) {
    return DEFAULT_AVATAR;
  }

  const normalized = profilePhoto.trim();
  if (!normalized) {
    return DEFAULT_AVATAR;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:image/") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  if (/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    return `data:image/png;base64,${normalized}`;
  }

  return DEFAULT_AVATAR;
}

function validateProfilePhoto(file: File | null): string | undefined {
  if (!file) {
    return undefined;
  }

  if (!allowedProfilePhotoTypes.includes(file.type)) {
    return "Foto profile harus berformat PNG atau JPG.";
  }

  if (file.size > MAX_PROFILE_PHOTO_SIZE) {
    return "Ukuran foto profile maksimal 5MB.";
  }

  return undefined;
}

function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const normalizedName = values.name.trim();
  const normalizedPhone = values.phone.trim();

  if (!normalizedName) {
    errors.name = "Nama wajib diisi.";
  } else if (normalizedName.length < 3) {
    errors.name = "Nama minimal 3 karakter.";
  }

  if (!normalizedPhone) {
    errors.phone = "Nomor handphone wajib diisi.";
  } else if (!phoneRegex.test(normalizedPhone)) {
    errors.phone = "Nomor handphone tidak valid.";
  }

  const profilePhotoError = validateProfilePhoto(values.profilePhoto);
  if (profilePhotoError) {
    errors.profilePhoto = profilePhotoError;
  }

  return errors;
}

function normalizeRole(role: string): UserRole {
  return role === "ADMIN" ? "ADMIN" : "USER";
}

export function ProfileTabContent() {
  const token = getAuthToken();
  const hasToken = Boolean(token);
  const authUser = getAuthUser();
  const { showErrorToast, showSuccessToast } = useAppToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: "",
    phone: "",
    profilePhoto: null,
  });
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const {
    data,
    error,
    isError,
    isLoading,
    refetch,
  } = useMyProfileQuery({
    token,
    enabled: hasToken,
  });

  const profile = data?.profile;
  const displayName = profile?.name || authUser?.name || "-";
  const displayEmail = profile?.email || authUser?.email || "-";
  const displayPhone = profile?.phone || authUser?.phone || "-";
  const displayProfilePhoto = resolveProfilePhoto(
    profile?.profilePhoto ?? authUser?.profilePhoto,
  );
  const fallbackName = getInitials(displayName === "-" ? "User" : displayName);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      return updateMyProfile({
        token,
        name: values.name.trim(),
        phone: values.phone.trim(),
        profilePhoto: values.profilePhoto,
      });
    },
    onSuccess: async (response) => {
      if (!token || !response.data?.profile) {
        return;
      }

      const queryKey = tanstackQueryKeys.profile.detail(token);

      queryClient.setQueryData<MyProfileData>(queryKey, {
        profile: response.data.profile,
      });

      let latestProfileData: MyProfileData | undefined;

      try {
        latestProfileData = await queryClient.fetchQuery({
          queryKey,
          queryFn: ({ signal }) =>
            fetchMyProfile(
              {
                token,
              },
              signal,
            ),
        });
      } catch (fetchError) {
        const latestErrorMessage =
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal memuat profile terbaru.";
        showErrorToast(
          `Profile diperbarui, tapi sinkron profile terbaru gagal: ${latestErrorMessage}`,
        );
      }

      const latestProfile = latestProfileData?.profile ?? response.data.profile;
      const existingUser = getAuthUser();

      const nextAuthUser: LoginUser = {
        id: latestProfile.id,
        name: latestProfile.name,
        email: latestProfile.email,
        phone: latestProfile.phone,
        profilePhoto: latestProfile.profilePhoto,
        role: normalizeRole(latestProfile.role),
      };

      saveAuthUser(existingUser ? { ...existingUser, ...nextAuthUser } : nextAuthUser);

      setIsDialogOpen(false);
      setFormErrors({});
      setFormValues((previous) => ({ ...previous, profilePhoto: null }));
      setPhotoPreviewUrl(null);
      showSuccessToast(response.message || "Profile berhasil diperbarui.");
    },
    onError: (mutationError) => {
      const message = mutationError.message || "Gagal memperbarui profile.";
      setFormErrors((previous) => ({
        ...previous,
        form: message,
      }));
      showErrorToast(message);
    },
  });

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const fileError = validateProfilePhoto(selectedFile);

    if (fileError) {
      setFormErrors((previous) => ({
        ...previous,
        profilePhoto: fileError,
      }));
      event.target.value = "";
      return;
    }

    if (photoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPhotoPreviewUrl(nextPreviewUrl);
    setFormValues((previous) => ({
      ...previous,
      profilePhoto: selectedFile,
    }));
    setFormErrors((previous) => ({
      ...previous,
      profilePhoto: undefined,
      form: undefined,
    }));
  };

  const handleOpenUpdateProfileDialog = () => {
    setFormValues({
      name: profile?.name ?? authUser?.name ?? "",
      phone: profile?.phone ?? authUser?.phone ?? "",
      profilePhoto: null,
    });
    setFormErrors({});
    setPhotoPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const handleSubmitUpdateProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValues: ProfileFormValues = {
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      profilePhoto: formValues.profilePhoto,
    };

    const validationErrors = validateProfileForm(normalizedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    updateProfileMutation.mutate(normalizedValues);
  };

  const isSubmitting = updateProfileMutation.isPending;
  const photoInDialog = photoPreviewUrl ?? displayProfilePhoto;

  return (
    <section className="grid w-full gap-4 md:w-139.25">
      <h1 className="display-xs md:display-sm font-extrabold text-neutral-950">
        Profile
      </h1>

      <article className="shadow-card grid gap-4 rounded-3xl p-4 lg:p-5" id="card-profile">
        {isLoading && !profile ? (
          <>
            <Skeleton className="size-16 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-full" />
          </>
        ) : (
          <>
            <Avatar className="size-16">
              <AvatarImage alt={displayName} src={displayProfilePhoto} />
              <AvatarFallback>{fallbackName}</AvatarFallback>
            </Avatar>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-950 md:text-md">Name</span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {displayName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-950 md:text-md">Email</span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {displayEmail}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-950 md:text-md">
                  Nomor Handphone
                </span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {displayPhone}
                </span>
              </div>
            </div>

            {isError ? (
              <div className="grid gap-2 rounded-2xl border border-danger-300/30 bg-danger-300/10 p-3">
                <p className="text-sm font-medium text-danger-300">
                  {(error as Error)?.message || "Gagal memuat profile."}
                </p>
                <Button
                  className="h-10 w-fit rounded-full border-neutral-300 px-4 text-sm font-semibold"
                  onClick={() => refetch()}
                  type="button"
                  variant="outline"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : null}

            {!hasToken ? (
              <p className="rounded-2xl border border-danger-300/30 bg-danger-300/10 px-3 py-2 text-sm font-medium text-danger-300">
                Sesi login tidak ditemukan. Silakan login kembali.
              </p>
            ) : null}

            <Button
              className="h-11 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
              disabled={!hasToken}
              onClick={handleOpenUpdateProfileDialog}
              type="button"
            >
              Update Profile
            </Button>
          </>
        )}
      </article>

      <Dialog
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setFormErrors({});
            setFormValues((previous) => ({ ...previous, profilePhoto: null }));
            setPhotoPreviewUrl(null);
          }
        }}
        open={isDialogOpen}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-xl rounded-3xl border-neutral-200 bg-neutral-25 p-4 md:p-6">
          <DialogTitle className="text-lg font-extrabold text-neutral-950 md:display-xs">
            Update Profile
          </DialogTitle>

          <form className="grid gap-4" noValidate onSubmit={handleSubmitUpdateProfile}>
            {formErrors.form ? (
              <p
                className="rounded-xl bg-danger-300/10 px-4 py-2 text-sm font-semibold text-danger-300"
                role="alert"
              >
                {formErrors.form}
              </p>
            ) : null}

            <div className="grid gap-2">
              <span className="text-sm font-bold text-neutral-950 md:text-md">
                Profile Picture
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Avatar className="size-16">
                  <AvatarImage alt={formValues.name || "Profile photo"} src={photoInDialog} />
                  <AvatarFallback>
                    {getInitials(formValues.name || displayName || "User")}
                  </AvatarFallback>
                </Avatar>

                <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold text-neutral-950 hover:bg-neutral-100">
                  <Upload className="h-4 w-4" />
                  Pilih Foto
                  <input
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={handleProfilePhotoChange}
                    type="file"
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-700 md:text-sm">
                Format: PNG atau JPG. Maksimal 5MB.
              </p>
              {formErrors.profilePhoto ? (
                <p className="text-sm text-danger-300">{formErrors.profilePhoto}</p>
              ) : null}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-bold text-neutral-950 md:text-md" htmlFor="name">
                Nama
              </label>
              <Input
                className={`h-11 rounded-xl border ${
                  formErrors.name ? "border-danger-300" : "border-neutral-300"
                } bg-neutral-25 px-4 text-sm text-neutral-950 shadow-none focus-visible:ring-0 md:text-md`}
                disabled={isSubmitting}
                id="name"
                onChange={(event) => {
                  setFormValues((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }));
                  setFormErrors((previous) => ({
                    ...previous,
                    name: undefined,
                    form: undefined,
                  }));
                }}
                placeholder="Masukkan nama"
                value={formValues.name}
              />
              {formErrors.name ? (
                <p className="text-sm text-danger-300">{formErrors.name}</p>
              ) : null}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-bold text-neutral-950 md:text-md" htmlFor="phone">
                Nomor Handphone
              </label>
              <Input
                className={`h-11 rounded-xl border ${
                  formErrors.phone ? "border-danger-300" : "border-neutral-300"
                } bg-neutral-25 px-4 text-sm text-neutral-950 shadow-none focus-visible:ring-0 md:text-md`}
                disabled={isSubmitting}
                id="phone"
                onChange={(event) => {
                  setFormValues((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }));
                  setFormErrors((previous) => ({
                    ...previous,
                    phone: undefined,
                    form: undefined,
                  }));
                }}
                placeholder="Contoh: 081234567890"
                value={formValues.phone}
              />
              {formErrors.phone ? (
                <p className="text-sm text-danger-300">{formErrors.phone}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                className="h-11 rounded-full border-neutral-300 px-5 text-sm font-semibold"
                disabled={isSubmitting}
                onClick={() => setIsDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Batal
              </Button>
              <Button
                className="h-11 rounded-full bg-primary-300 px-5 text-sm font-bold text-neutral-25 hover:bg-primary-300/90"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
