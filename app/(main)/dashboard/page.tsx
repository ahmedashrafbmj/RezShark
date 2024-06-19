"use client";
import Header from "@/components/header";
import ReservationForm from "@/components/reservationForm";
import { withAuth } from "@/components/withAuth";
import { NextPage } from "next";

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
	return (
		<div className="flex-col ">
			{/* <div className="w-full h-12 bg-green-500 flex justify-center items-center">
				<span className="text-xl text-white font-medium">
					Current Status :
					<span className="text-xl font-bold ">Running</span>
				</span>
			</div> */}
			<Header title="Tee Time Reservation Finder" showBack />
			<div className="lg:px-20">
				<ReservationForm />
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
