"use client";
import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useUserStore } from "@/utils/store";
import Loading from "./loading";

let adminRoutes = ["/signup", "/users"];

export const withAuth = (WrappedComponent: any) => {
	return function WithAuth(props: any) {
		const path = usePathname();
		const [isLoading, setIsLoading] = useState(true);

		const isHydrated = useUserStore((state) => state.isHydrates);
		const userData = useUserStore((state) => state.user);

		useEffect(() => {
			if (isHydrated) {
				if (userData != null) {
					if (adminRoutes.includes(path) && !userData.isAdmin) {
						redirect("/list");
					} else {
						setIsLoading(false);
					}
				} else {
					redirect("/");
				}
			}
		}, [isHydrated]);

		if (isLoading) {
			return <Loading />;
		}
		return <WrappedComponent {...props} />;
	};
};
