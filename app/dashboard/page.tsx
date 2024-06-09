"use client";
import Loading from "@/components/loading";
import ReservationForm from "@/components/reservationForm";
import { useUserStore } from "@/utils/store";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
	const [isLoading, setIsLoading] = useState(true);

	const isHydrated = useUserStore((state) => state.isHydrates);
	const userData = useUserStore((state) => state.user);

	useEffect(() => {
		if (isHydrated) {
			if (userData != null) {
				setIsLoading(false);
			} else {
				redirect("/");
			}
		}
	}, [isHydrated]);

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col ">
			<div className="w-full h-24 bg-blue-700 flex justify-center items-center">
				<span className="text-2xl text-white font-bold">Welcome</span>
			</div>
			<div className="w-full h-12 bg-green-500 flex justify-center items-center">
				<span className="text-xl text-white font-medium">
					Current Status :{" "}
					<span className="text-xl font-bold ">Running</span>
				</span>
			</div>

			<div className="lg:px-20">
				<ReservationForm />
			</div>
		</div>
	);
};

export default Dashboard;
