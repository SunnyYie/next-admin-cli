import userService, { type SignInReq } from "../api/services/userService";
import { StorageEnum, UserInfo, UserToken } from "@/types/store/type";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { mergeRoutes } from "../router/utils";
import { useNavigate } from "react-router";
import { create } from "zustand";
import { toast } from "sonner";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
	userInfo: Partial<UserInfo>;
	userToken: UserToken;
	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
			},
		}),
		// 将数据存储到 localStorage
		{
			name: "userStore",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserPermissionKeys = () => useUserStore((state) => state.userInfo.permissionKeys);
export const useUserFlattenPermissions = () => useUserStore((state) => state.userInfo.flattenPermissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const navigatge = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.signin,
	});

	const signIn = async (data: SignInReq) => {
		try {
			const res = await signInMutation.mutateAsync(data);
			const { user, accessToken, refreshToken } = res;

			setUserToken({ accessToken, refreshToken });

			const permissions = mergeRoutes(user.permissions!);

			// 返回的是扁平化的权限列表，存储扁平化和未扁平化的权限列表
			setUserInfo({
				...user,
				permissions,
				flattenPermissions: user.permissions!,
			});

			toast.success("登陆成功");
			navigatge(HOMEPAGE);
		} catch (err: any) {
			toast.error(err.message);
		}
	};

	return signIn;
};

export default useUserStore;
